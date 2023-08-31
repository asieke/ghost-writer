import { CustomDocument } from './customDocument';
import { CustomCodeBlock } from './customCodeBlock';
import { CustomTableCell } from './customTableCell';
import { CustomPlaceholder } from './customPlaceholder';
import { CustomFontMenu } from './customFontMenu/fontMenu';
import { Slash } from './slash/slash';

import Paragraph from '@tiptap/extension-paragraph';
import Link from '@tiptap/extension-link';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Table from '@tiptap/extension-table';
import Blockquote from '@tiptap/extension-blockquote';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import Image from '@tiptap/extension-image';

import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

import { lowlight } from 'lowlight/lib/core';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

lowlight.registerLanguage('js', js);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('ts', ts);

export const extensions = [
	Slash,
	CustomFontMenu,
	Underline,
	TextAlign.configure({
		types: ['heading', 'paragraph']
	}),
	Strike,
	TaskList,
	TaskItem.configure({
		nested: true
	}),
	Link,
	Image,
	Gapcursor,
	Heading,
	CustomDocument,
	Paragraph,
	Text,
	Bold,
	Code,
	Italic,
	Dropcursor,
	HorizontalRule,
	History,
	Blockquote,
	Highlight.configure({
		multicolor: true
	}),
	Typography,
	OrderedList,
	BulletList,
	ListItem,
	CustomCodeBlock.configure({
		lowlight
	}),
	Table.configure({
		resizable: true,
		handleWidth: 5,
		cellMinWidth: 100
	}),
	TableRow,
	TableHeader,
	CustomTableCell,
	CustomPlaceholder
];
