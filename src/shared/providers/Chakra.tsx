"use client"
import React, { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
interface ChakraProviderProps {
  children: ReactNode;
}

const Chakra: React.FC<ChakraProviderProps> = ({ children }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
};

export default Chakra;  