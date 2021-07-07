import styled, { css } from "styled-components";
import { Icon } from "../Icon/Icon";

interface ContainedButtonProps extends React.HTMLProps<HTMLButtonElement> {
  label?: string;
  icon?: string;
  variant?: "primary" | "secondary";
}

const Wrapper = styled.button<ContainedButtonProps>`
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  width: 100%;
  font-family: "Open Sans", sans-serif;
  color: #00adef;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-size: 11px;
  line-height: 15px;
  transition: all 0.1s ease-in;
  margin: 0;
  padding: 0;
  min-height: 35px;
  border-radius: 4px;
  justify-content: center;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
  ${({ variant }) =>
    variant === "primary" &&
    css`
      background: linear-gradient(
          90deg,
          rgba(0, 78, 112, 0.4) 0%,
          rgba(0, 78, 112, 0.4) 0.01%,
          rgba(0, 78, 112, 0) 0.02%
        ),
        linear-gradient(90deg, #00adef 0%, #018cb7 146.43%);
      border: none;
      color: #fff;
    `}
  ${({ variant }) =>
    variant === "secondary" &&
    css`
      background: #fff;
      border: 1px solid #dddddd;
    `}

  &:hover {
    opacity: 0.5;
  }

  img {
    margin-right: 7px;
  }
`;

export const ContainedButton = ({
  label,
  icon,
  variant = "secondary",
  ...rest
}: ContainedButtonProps) => {
  return (
    <Wrapper variant={variant} {...rest}>
      {icon && <Icon src={icon} />}
      {label}
    </Wrapper>
  );
};
