import React from 'react';
import styled from 'styled-components';

const Card = ({ image, title, subtitle }) => {
    return (
        <StyledWrapper>
            <div className="card">
                <div className="corner top-left">✦</div>
                <div className="corner top-right">✦</div>

                {image && (
                    <div className="card-image">
                        <img src={image} alt={title} />
                    </div>
                )}

                <div className="card-body">
                    {title && <span className="card-title">{title}</span>}
                    {subtitle && <span className="card-subtitle">{subtitle}</span>}
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;700&display=swap');

    .card {
        position: relative;
        width: 190px;
        height: 254px;

        background:
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22) 0%, transparent 22%),
                radial-gradient(circle at 80% 30%, rgba(255,255,255,0.13) 0%, transparent 18%),
                repeating-linear-gradient(
                        45deg,
                        rgba(255,255,255,0.025) 0px,
                        rgba(255,255,255,0.025) 2px,
                        transparent 2px,
                        transparent 5px
                ),
                #d8c6b4;

        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 18px;
        overflow: hidden;

        display: flex;
        flex-direction: column;

        box-shadow:
                0 12px 32px rgba(0,0,0,0.22),
                inset 0 0 0 1px rgba(61,43,31,0.12),
                inset 0 2px 8px rgba(255,255,255,0.25);

        transition: 0.35s ease;
        cursor: pointer;
    }

    .card::before {
        content: "";
        position: absolute;
        inset: 8px;
        border: 1px solid rgba(122, 92, 70, 0.35);
        border-radius: 13px;
        pointer-events: none;
        z-index: 3;
    }

    .card:hover {
        transform: translateY(-7px) scale(1.03);
        border-color: #8c6f61;
        box-shadow:
                0 18px 38px rgba(0,0,0,0.28),
                inset 0 0 0 1px rgba(61,43,31,0.16);
    }

    .card:active {
        transform: scale(0.97);
    }

    .corner {
        position: absolute;
        z-index: 4;
        top: 8px;
        font-size: 13px;
        color: rgba(122, 92, 70, 0.8);
        text-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }

    .top-left {
        left: 12px;
    }

    .top-right {
        right: 12px;
    }

    .card-image {
        width: 100%;
        height: 40%;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        padding: 9px 9px 0 9px;

        border-radius: 17px 17px 0 0;

        filter: sepia(0.12) contrast(0.95);

        transition: 0.35s ease;
    }


    .card-image::after {
        content: "";
        position: absolute;

        bottom: -1px;
        left: 8px;
        right: 8px;

        height: 4px;

        background:#8c6f61;

        border-top: 1px solid rgba(255,255,255,0.25);

        box-shadow:
                0 -2px 5px rgba(0,0,0,0.15),
                inset 0 1px 1px rgba(255,255,255,0.2);

        border-radius: 0 0 10px 10px;

        z-index: 2;
    }

    .card-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 14px 14px 16px;
        text-align: center;
    }

    .card-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 25px;
        font-weight: 700;
        color: #7A5C46;
        text-shadow: 0 2px 7px rgba(0,0,0,0.18);
        line-height: 0.95;
        margin-bottom: 6px;
        letter-spacing: 0.04em;
    }

    .card-subtitle {
        font-family: 'Cormorant Garamond', serif;
        font-size: 12px;
        font-style: italic;
        font-weight: 700;
        color: rgba(61, 43, 31, 0.75);
        letter-spacing: 0.08em;
        line-height: 1.2;
    }
`;

export default Card;