import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  cartCount: number;
  userName?: string;
  logIn: (accessToken: string, refreshToken: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOG_IN_AS_GUEST = gql`
  mutation LogInAsGuest($regionId: ID!) {
    logInAsGuest(regionId: $regionId) {
      accessToken
      refreshToken
    }
  }
`;

const GET_CART_COUNT = gql`
  query GetCartCount {
    cart {
      items(first: 1) {
        totalQuantity
      }
    }
  }
`;

const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      ... on RegisteredViewer {
        name
      }
    }
  }
`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const [loginAsGuest] = useMutation(LOG_IN_AS_GUEST);
  const { data: cartData } = useQuery(GET_CART_COUNT, { skip: !accessToken });
  const { data: viewerData } = useQuery(GET_VIEWER, { skip: !accessToken });

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessToken');
    const storedRefresh = localStorage.getItem('refreshToken');

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    } else {
      loginAsGuest({ variables: { regionId: '1' } }).then(({ data }) => {
        const { accessToken, refreshToken } = data.logInAsGuest;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      });
    }
  }, []);

  const logIn = (newAccess: string, newRefresh: string) => {
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    localStorage.setItem('accessToken', newAccess);
    localStorage.setItem('refreshToken', newRefresh);
  };

  const logOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      cartCount: cartData?.cart.items.totalQuantity ?? 0,
      userName: viewerData?.viewer?.name,
      logIn,
      logOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
