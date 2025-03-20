
import React from "react";
import { Flex, styled } from "@sparrowengg/twigs-react";

const StyledFlex = ({ children, css }) => {
    return(
      <Flex alignItems="center" flexDirection="column" justifyContent="center" css={css}>
      {children}
      </Flex>)
    }

export default StyledFlex;