import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

describe('The App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('displays the right title', () => {
    const component = shallow(<App />);
    const headerText = component.find('.app-header h2').text();
    expect(headerText).toEqual('UNHCR Data Browser');
  });
});
