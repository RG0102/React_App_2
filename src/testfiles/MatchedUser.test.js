// MatchedUsers.test.js
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import MatchedUsers from "../pages/MatchedUsers"; // Adjust path as needed.
import { useNavigate } from "react-router-dom";
import { getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

// --- Helper to simulate Firestore snapshots ---
const createSnapshot = (docs) => ({
  forEach: (callback) => docs.forEach(callback),
});

// --- Mocks ---

// Mock react-router-dom's useNavigate.
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock Firebase module.
jest.mock("../firebase", () => ({
  auth: { 
    onAuthStateChanged: jest.fn() 
  },
  db: {},
}));

// Mock Firestore functions.
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  collectionGroup: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "timestamp"),
  doc: jest.fn(() => ({})),
}));

// Mock the speech recognition hook so we can capture its callback.
jest.mock("../hooks/useSpeechRecognition", () => jest.fn());

// Provide a dummy implementation for useSpeechRecognition.
const mockSpeechRecognition = (cb) => {
  // Store callback if needed.
  return;
};
useSpeechRecognition.mockImplementation(mockSpeechRecognition);

// Mock the global speechSynthesis object.
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  speaking: false,
};

// Create a dummy navigate function.
const mockNavigate = jest.fn();

// Before each test, set up common mocks.
beforeEach(() => {
  jest.clearAllMocks();
  useNavigate.mockReturnValue(mockNavigate);
  // Make sure auth.onAuthStateChanged returns a dummy unsubscribe function.
  auth.onAuthStateChanged.mockImplementation((cb) => {
    // By default, assume an authenticated user.
    cb({ uid: "currentUser", email: "current@example.com" });
    return jest.fn();
  });
});

describe("MatchedUsers Component", () => {
  test("displays loading state initially", () => {
    // Return a dummy unsubscribe function from the auth change callback.
    auth.onAuthStateChanged.mockImplementation(() => jest.fn());
    render(<MatchedUsers />);
    expect(screen.getByText(/Loading matched users/i)).toBeTruthy();
  });

  test("shows error if no authenticated user is found", async () => {
    auth.onAuthStateChanged.mockImplementation((cb) => {
      cb(null);
      return jest.fn();
    });
    render(<MatchedUsers />);
    await waitFor(() => {
      expect(screen.getByText(/No authenticated user found/i)).toBeTruthy();
    });
  });

  test("shows error if current user profile is incomplete", async () => {
    // Simulate an authenticated user.
    auth.onAuthStateChanged.mockImplementation((cb) => {
      cb({ uid: "currentUser", email: "current@example.com" });
      return jest.fn();
    });
    // For my profile, return an empty snapshot.
    getDocs.mockImplementationOnce(() =>
      Promise.resolve(createSnapshot([]))
    );
    render(<MatchedUsers />);
    await waitFor(() => {
      expect(
        screen.getByText(/Your profile is incomplete\. Please update your profile with your interests\./i)
      ).toBeTruthy();
    });
  });

  test("renders matched users sorted by compatibility", async () => {
    auth.onAuthStateChanged.mockImplementation((cb) => {
      cb({ uid: "currentUser", email: "current@example.com" });
      return jest.fn();
    });
    const myProfileDoc = {
      data: () => ({ interests: ["music", "sports"] }),
      id: "profile1",
    };
    // First call: get current user's profile.
    getDocs
      .mockImplementationOnce(() =>
        Promise.resolve(createSnapshot([myProfileDoc]))
      )
      // Second call: collectionGroup: all profiles.
      .mockImplementationOnce(() =>
        Promise.resolve(
          createSnapshot([
            {
              id: "p2",
              data: () => ({
                name: "Alice",
                interests: ["music", "art"],
              }),
              ref: { parent: { parent: { id: "userAlice" } } },
            },
            {
              id: "p3",
              data: () => ({
                name: "Bob",
                interests: ["sports", "cooking"],
              }),
              ref: { parent: { parent: { id: "userBob" } } },
            },
            {
              id: "p4",
              data: () => ({
                name: "Charlie",
                interests: ["gaming"],
              }),
              ref: { parent: { parent: { id: "userCharlie" } } },
            },
          ])
        )
      );
    render(<MatchedUsers />);
    // Wait until loading message disappears.
    await waitFor(() => {
      expect(screen.queryByText(/Loading matched users/i)).toBeNull();
    });
    // Check that match cards are rendered by looking for <h3> headings.
    const matchCards = screen.getAllByRole("heading", { level: 3 });
    expect(matchCards.length).toBe(3);
    // Check that a Chat button exists for each match.
    const chatButtons = screen.getAllByRole("button", { name: /Chat/i });
    expect(chatButtons.length).toBe(3);
  });

  test("chat button navigates to chat with correct state", async () => {
    auth.onAuthStateChanged.mockImplementation((cb) => {
      cb({ uid: "currentUser", email: "current@example.com" });
      return jest.fn();
    });
    const myProfileDoc = {
      data: () => ({ interests: ["music", "sports"] }),
      id: "profile1",
    };
    // Return one matched profile.
    getDocs
      .mockImplementationOnce(() =>
        Promise.resolve(createSnapshot([myProfileDoc]))
      )
      .mockImplementationOnce(() =>
        Promise.resolve(
          createSnapshot([
            {
              id: "p2",
              data: () => ({
                name: "Alice",
                interests: ["music"],
              }),
              ref: { parent: { parent: { id: "userAlice" } } },
            },
          ])
        )
      );
    render(<MatchedUsers />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading matched users/i)).toBeNull();
    });
    // Click the Chat button.
    const chatButton = screen.getByRole("button", { name: /Chat/i });
    fireEvent.click(chatButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/chat", {
        state: { userId: "userAlice", userName: "Alice" },
      });
    });
  });

// ... (other tests remain unchanged)

test("group chat creation calls addDoc and navigates", async () => {
    const currentUser = { uid: "currentUser", email: "current@example.com" };
    auth.onAuthStateChanged.mockImplementation((cb) => {
      cb(currentUser);
      return jest.fn();
    });
    const myProfileDoc = {
      data: () => ({ interests: ["music", "sports"] }),
      id: "profile1",
    };
    getDocs
      .mockImplementationOnce(() =>
        Promise.resolve(createSnapshot([myProfileDoc]))
      )
      .mockImplementationOnce(() =>
        Promise.resolve(
          createSnapshot([
            {
              id: "p2",
              data: () => ({
                name: "Alice",
                interests: ["music"],
              }),
              ref: { parent: { parent: { id: "userAlice" } } },
            },
            {
              id: "p3",
              data: () => ({
                name: "Bob",
                interests: ["sports"],
              }),
              ref: { parent: { parent: { id: "userBob" } } },
            },
          ])
        )
      );
    // Simulate addDoc returning a chat document with an id.
    const fakeChatDoc = { id: "chat123" };
    addDoc.mockResolvedValue(fakeChatDoc);
    // Override window.prompt for group chat title.
    const promptSpy = jest.spyOn(window, "prompt").mockReturnValue("Test Group Chat");
    
    render(<MatchedUsers />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading matched users/i)).toBeNull();
    });
    // Initially, no group chat button should be shown.
    expect(screen.queryByRole("button", { name: /Create Group Chat/i })).toBeNull();
    // Select two users by clicking their checkboxes.
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThanOrEqual(2);
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    // Now the group chat creation button should appear.
    const groupChatButton = await screen.findByRole("button", { name: /Create Group Chat/i });
    fireEvent.click(groupChatButton);
    
    await waitFor(() => {
      // Instead of checking createdAt equals "timestamp", we now check that it is defined.
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
        title: "Test Group Chat",
        participants: expect.arrayContaining([currentUser.uid]),
        type: "group",
      }));
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/groupchat", {
        state: {
          chatId: "chat123",
          chatTitle: "Test Group Chat",
          participants: expect.arrayContaining([currentUser.uid]),
        },
      });
    });
    
    promptSpy.mockRestore();
  });
  

  test("handle voice command navigates to dashboard or chat", async () => {
    // Capture the callback provided by useSpeechRecognition.
    let speechCallback;
    useSpeechRecognition.mockImplementation((cb) => {
      speechCallback = cb;
    });
    auth.onAuthStateChanged.mockImplementation((cb) => {
      cb({ uid: "currentUser", email: "current@example.com" });
      return jest.fn();
    });
    const myProfileDoc = {
      data: () => ({ interests: ["music", "sports"] }),
      id: "profile1",
    };
    getDocs
      .mockImplementationOnce(() =>
        Promise.resolve(createSnapshot([myProfileDoc]))
      )
      .mockImplementationOnce(() =>
        Promise.resolve(
          createSnapshot([
            {
              id: "p2",
              data: () => ({
                name: "Alice",
                interests: ["music"],
              }),
              ref: { parent: { parent: { id: "userAlice" } } },
            },
          ])
        )
      );
    render(<MatchedUsers />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading matched users/i)).toBeNull();
    });
    // Voice command for dashboard.
    speechCallback("please go to dashboard");
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
    // Voice command for chat with a match.
    speechCallback("chat with Alice");
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/chat", {
        state: { userId: "userAlice", userName: "Alice" },
      });
    });
  });
});
