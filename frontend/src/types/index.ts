export interface LandingProps {
  isLoggedIn: boolean;
  userName?: string;
}

export interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}