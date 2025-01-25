import styled from 'styled-components';

// Container for the form
export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
`;

// Form style
export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
    gap: 10px;
`;

// Title of the form
export const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

// Basic input field style
export const Input = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

// Button style
export const Button = styled.button`
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

// Paragraph for showing status
export const Paragraph = styled.p`
    text-align: center;
    font-size: 16px;
    margin-top: 15px;
    color: #333;
`;

export const Error = styled.p`
    text-align: center;
    font-size: 14px;	
    color: red; 
    margin-top: 10px;
`;