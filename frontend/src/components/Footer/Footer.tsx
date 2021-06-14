import React from "react";
import { StyledInternalLink } from "../../theme";
import FooterLogo from "./FooterLogo";
import Nav from "./Nav";
import { Container, StyledFooter, StyledNav } from "./styled";

function Footer() {
  return (
      <Container>
    <StyledFooter>
        <StyledNav>
          <FooterLogo />
          <StyledInternalLink to="/faq">FAQ</StyledInternalLink>
        </StyledNav>
        <Nav />
    </StyledFooter>
      </Container>
  );
}

export default Footer;
