import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElem = async (testId: string, canvas: any): Promise<HTMLElement> => {
  const elem = await canvas.getByTestId(testId);
  return elem;
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
