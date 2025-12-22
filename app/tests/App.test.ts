import { render } from '@testing-library/svelte';
import App from '../src/App.svelte';

test('renders the correct message', () => {
  const { getByText } = render(App);
  expect(getByText('Hello, Scribel!')).toBeTruthy();
});
