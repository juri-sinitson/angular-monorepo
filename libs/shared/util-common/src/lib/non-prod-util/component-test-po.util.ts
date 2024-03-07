import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// TODO: wrap them in a class or an object to avoid name conflicts
// in the future

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElem = async (testId: string, canvas: any): Promise<HTMLElement> => {
  const elem = await canvas.getByTestId(testId);
  return elem;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFirstElem = async (testId: string, canvas: any): Promise<HTMLElement> => {
  const elems = await canvas.getAllByTestId(testId);
  return elems[0];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFirstElemByText = async (text: string, canvas: any): Promise<HTMLElement> => {
  const elems = await canvas.getAllByText(text);
  return elems[0];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clickElem = async (testId: string, canvas: any): Promise<void> => {
  const elem = await getElem(testId, canvas);
  await userEvent.click(elem);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectElem = async (testId: string, canvas: any): Promise<void> => {
  const elem = await getElem(testId, canvas);
  expect(elem).toBeTruthy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectNoElem = async (testId: string, canvas: any): Promise<void> => {
  const elem = canvas.queryByTestId(testId, canvas);
  expect(elem).toBeFalsy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCanvas = (canvasElement: HTMLElement): any => {
  return within(canvasElement);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectText = async (text: string, canvas: any): Promise<void> => {
  expect(canvas.getByText(text)).toBeTruthy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectNoText = async (text: string, canvas: any): Promise<void> => {
  expect(canvas.queryByText(text)).toBeFalsy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectTableColElemText = async (testId: string, textContent: string, canvas: any): Promise<void> => {
  const elem = await getElem(testId, canvas);
  expect(elem).toHaveTextContent(textContent);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectTableValueElemText = async (testId: string, textContent: string, canvas: any): Promise<void> => {
  const elem = await getFirstElem(testId, canvas);  
  expect(elem).toHaveTextContent(textContent);
}
