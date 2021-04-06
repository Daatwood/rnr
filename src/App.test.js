import { render, screen } from '@testing-library/react';
import GameView from './views/GameView';

test('renders learn react link', () => {
  render(<GameView />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
