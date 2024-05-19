import { expect, userEvent, within } from '@storybook/test';

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
export const countElemsByText = async (text: string, canvas: any): Promise<number> => {
  const elems = await canvas.getAllByText(text);
  return Promise.resolve(elems.length);
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
export const expectElemOfMultiple = async (testId: string, canvas: any): Promise<void> => {
  const elem = await getFirstElem(testId, canvas);
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
export const getSubCanvasByTestId = async (testId: string, canvas: HTMLElement): Promise<any> => {
  const elem: HTMLElement = await getElem(testId, canvas);
  return within(elem);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectText = async (text: string, canvas: any): Promise<void> => {
  expect(canvas.getByText(text)).toBeTruthy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectNoText = async (text: string, canvas: any): Promise<void> => {
  expect(canvas.queryByText(text)).toBeFalsy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectToHaveText = async (testId: string, textContent: string, canvas: any): Promise<void> => {
  const elem = await getElem(testId, canvas);  
  expect(elem).toHaveTextContent(textContent);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectTableValueElemText = async (testId: string, textContent: string, canvas: any): Promise<void> => {
  const elem = await getFirstElem(testId, canvas);  
  expect(elem).toHaveTextContent(textContent);
}

export const expectTableColElemText = async (testId: string, textContent: string, 
  canvas: HTMLCanvasElement): Promise<void> => {
  expectToHaveText(testId, textContent, canvas);
}

// ----- FORM
// -- form inputs
export const expectTextInputValue = async (testId: string, value: string, 
  canvas: HTMLCanvasElement): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elem: any = await getElem(testId, canvas); 
  expect(elem.value).toBe(value);
}

export const expectNumberInputValue = async (testId: string, value: string, 
  canvas: HTMLCanvasElement): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentElem: any = await getElem(testId, canvas); 
  const elem = parentElem.querySelector('input');
  expect(elem.value).toBe(value);
}

export const expectNumberInputToContainValue = async (testId: string, value: string, 
  canvas: HTMLCanvasElement): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentElem: any = await getElem(testId, canvas); 
  const elem = parentElem.querySelector('input');
  expect(elem.value).toContain(value);
}

export const expectDropdownValue = async (testId: string, value: string, 
  canvas: HTMLCanvasElement): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentElem: any = await getElem(testId, canvas); 
  const elem = parentElem.querySelector('span');
  expect(elem).toHaveTextContent(value);
}

const getInputElem = async (testId: string, canvas: HTMLCanvasElement): Promise<HTMLInputElement> => {  
  const elem: HTMLElement = await getElem(testId, canvas);  
  let result: HTMLInputElement | null = null;
  
  if (elem.tagName === 'INPUT') {
    result = elem as HTMLInputElement;
  } else {
    result = elem.querySelector('input');
  }
  
  if(!result) {
    throw new Error(`Element with testId ${testId} doesn't seem to be an input!`);
  }

  return Promise.resolve(result);
}

const typeToTextInputHelper = async (testId: string, value: string, 
  canvas: HTMLCanvasElement, defocus = true): Promise<void> => {  
  const inputElem: HTMLInputElement = await getInputElem(testId, canvas); 
  await userEvent.type(inputElem, value);
  inputElem.value = value;
  if (defocus) {
    await userEvent.tab();
  }
}

export const clearTextInput = async (testId: string, 
    canvas: HTMLCanvasElement, defocus = false): Promise<void> => {  
  const elem: HTMLElement = await getInputElem(testId, canvas);
  await userEvent.clear(elem);
  if (defocus) {
    await userEvent.tab();
  }
}

export const clearNumberInput = async (testId: string, 
    canvas: HTMLCanvasElement, defocus = false): Promise<void> => {  
  return clearTextInput(testId, canvas, defocus);
}

const getTextInputValue = async (testId: string, canvas: HTMLCanvasElement): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elem: any = await getInputElem(testId, canvas);
  return Promise.resolve(elem.value);
}

export const expectSubmitButtonDisabled = async (canvas: HTMLCanvasElement): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitButton: any = await getElem('submit-button', canvas);
  const submitButtonChild: HTMLElement = submitButton.querySelector('button');
  expect(submitButtonChild).toBeDisabled();
}

export const expectSubmitButtonEnabled = async (canvas: HTMLCanvasElement): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitButton: any = await getElem('submit-button', canvas);
  const submitButtonChild: HTMLElement = submitButton.querySelector('button');
  expect(submitButtonChild).not.toBeDisabled();
}

export const typeToTextInput = async (testId: string, value: string, 
  canvas: HTMLCanvasElement): Promise<void> => {
    await clearTextInput(testId, canvas);
    await typeToTextInputHelper(testId, value, canvas);
  };

export const expectFormInvalid = async (canvas: HTMLCanvasElement): Promise<void> => {  
  const form: HTMLElement = await getElem('form', canvas);
  // click somewhere in the form to trigger validation
  await userEvent.click(form);  
  expect(form).toHaveClass('ng-invalid');
  await expectSubmitButtonDisabled(canvas);
}

export const expectFormValid = async (canvas: HTMLCanvasElement, 
  checkSubmitButton = true
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form: any = await getElem('form', canvas);
  expect(form).toHaveClass('ng-valid');  
  if(checkSubmitButton) {
    await expectSubmitButtonEnabled(canvas);  
  }  
}

export const expectFormInvalidByTextInput = async (testId: string, 
  canvas: HTMLCanvasElement): Promise<void> => {  
  const valueBackup: string = await getTextInputValue(testId, canvas);
  await clearTextInput(testId, canvas);
  await expectFormInvalid(canvas);
  await typeToTextInputHelper(testId, valueBackup, canvas);
}
