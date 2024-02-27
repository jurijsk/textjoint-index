declare global {
	function find(term: string, caseSensitive: boolean, backwards: boolean, wrapAround: boolean, wholeWord: boolean, searchInFrames: boolean, showDialog: boolean): boolean;

	interface Window {
		contentIndex: any;
	}
	
}
export { };