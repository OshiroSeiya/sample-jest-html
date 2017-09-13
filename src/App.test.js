import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('App Snapshot', () => {
  const component = renderer.create(
    <App />
  );
  expect(component).toMatchSnapshot('App is displayed?');
});
