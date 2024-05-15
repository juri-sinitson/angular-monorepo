import { MessageInterface } from '../interfaces/message.interface';
import {
  expectElem,
  expectNoElem,
  expectNoText,
  expectText,
  getCanvas,
} from './component-test-po.util';

type CommonStory = {
  args: {
    messages: MessageInterface[];
    showContent: boolean;
    isLoading: boolean;
    loadingMessage?: string;
    header: string;
    noData?: boolean;
  };
  play?: ({ canvasElement }: { canvasElement: HTMLElement }) => void;
};

const errorMessages: MessageInterface[] = [
  {
    severity: 'error',
    summary: 'Error',
    detail: 'Error message',
  },
];

export const primaryStory: CommonStory = {
  args: {
    messages: [],
    showContent: true,
    isLoading: false,
    header: '',
  },
};


export const primaryTableStory: CommonStory = {
  args: {
    ...primaryStory.args,
    noData: false,    
  },
}

export const loadingStory: CommonStory = {
  args: {
    messages: [],
    showContent: true,
    isLoading: true,
    header: '',
    noData: false,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoText('Wrapped content', canvas);
    await expectElem('loading', canvas);
    await expectNoElem('messages', canvas);
  },
};

export const errorStory: CommonStory = {
  args: {
    messages: errorMessages,
    showContent: true,
    isLoading: false,
    header: '',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoElem('loading', canvas);
    await expectElem('messages', canvas);
    await expectText('Error', canvas);
  },  
};

export const noDataStory: CommonStory = {
  args: {
    messages: [],
    showContent: true,
    isLoading: false,
    noData: true,    
    header: '',    
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = getCanvas(canvasElement);
    await expectNoElem('loading', canvas);
    await expectNoElem('messages', canvas);
    await expectElem('no-data', canvas);
  },
};
