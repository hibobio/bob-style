export interface AddCard {
  title: string;
  subtitle?: string;
  action?: (...args: any[]) => void;
}
