import React from 'react';
import styled from 'styled-components';

const InputForm = () => {
    return (
        <StyledWrapper>
            <div className="input-wrapper">
                <input type="text" placeholder="Type here..." name="text" className="input" />
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .input-wrapper input {
    background-color: #eee;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    width: 13em;
    border-radius: 1rem;
    color: lightcoral;
    box-shadow: 0 0.4rem #dfd9d9;
    cursor: pointer;
  }

  .input-wrapper input:focus {
    outline-color: lightcoral;
  }`;

export default InputForm;
