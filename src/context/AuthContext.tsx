
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate authentication
      if (email === "demo@example.com" && password === "password") {
        const user = { id: "1", email, name: "Demo User" };
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return;
      }
      
      // Check if user exists in localStorage (for demo purposes)
      const registeredUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = registeredUsers.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        const user = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll store in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user already exists
      if (registeredUsers.some((u: any) => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed
      };
      
      registeredUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(registeredUsers));
      
      // Auto login after registration
      const user = { id: newUser.id, email: newUser.email, name: newUser.name };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
