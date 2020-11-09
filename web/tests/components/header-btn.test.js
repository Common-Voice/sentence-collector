import { shallow } from 'enzyme';
import React from 'react';

import HeaderBtn from '../../src/components/header-btn';

const clickHandler = jest.fn();

test('Header button should be rendered correctly when closed', () => {
  let component = shallow(<HeaderBtn isOpen={false} handleClick={clickHandler} />);
  expect(component).toMatchSnapshot();
});

test('Header button should be rendered correctly when open', () => {
  let component = shallow(<HeaderBtn isOpen={true} handleClick={clickHandler} />);
  expect(component).toMatchSnapshot();
});

test('Header button should close header on click', () => {
  let component = shallow(<HeaderBtn isOpen={true} handleClick={clickHandler} />);
  component.find('button').simulate('click');
  expect(clickHandler.mock.calls.length).toEqual(1);
});
