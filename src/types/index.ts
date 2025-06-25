export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  passwordConfirm: string;
}

// Room and Voting Types
export interface CreateRoomRequest {
  title: string;
  description: string;
}

export interface CreateRoomResponse {
  id: string;
  title: string;
  status: string;
  joinCode: string;
}

export interface Suggestion {
  id: string;
  text: string;
  votes: number;
}

export interface Room {
  id: string;
  title: string;
  description?: string;
  suggestions: Suggestion[];
  joinCode?: string;
  createdAt?: string;
  status?: string;
}

export interface SubmitVoteRequest {
  roomId: string;
  suggestionId: string;
  userId: string;
}

export interface SubmitVoteResponse {
  success: boolean;
  message: string;
  newVoteCount: number;
}

export interface DecisionRoom {
  id: string;
  title: string;
  description: string;
  options: string[];
  deadline: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  votes?: VoteResult[];
}

export interface VoteResult {
  option: string;
  count: number;
}

export interface ApiError {
  status: string;
  message: string;
}