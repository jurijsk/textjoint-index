
class Index {
	tokens: { [key: string]: Token } = Object.create(null);

	build = function build(this: Index, content: Array<string> | string){
		const tokens = this.tokens;
		let lastSeenIndex: {[key: string]: number} = {};
		let tokenSrt = content[0];
		let previous = new Token(tokenSrt, 0);
		previous.positions.set(0, 0);
		lastSeenIndex[content[0]] = 0; 
		tokens[content[0]] = previous;
	
		for (let i = 1; i < content.length; i++) {
			tokenSrt = content[i].toLowerCase();
			let token = tokens[tokenSrt] || new Token(tokenSrt, i);
			lastSeenIndex[tokenSrt] !== undefined && (token.positions.set(lastSeenIndex[tokenSrt], i));
			lastSeenIndex[tokenSrt] = i;
			token.positions.set(i, -1);
			tokens[tokenSrt] = token;
			previous = token;
		}
		return this;
	}

	getPositions = function getPositions(this: Index, query: string): number[]{
		let positions = new Array<number>();
		if(!query){
			return positions;
		}
		let depth = 0;
		let start = this.tokens[query[depth]];
		depth++;
		//let nextChar = ;
		if(query[depth] === undefined) {
			//end of query
			return positions; //return currentGlyph.positions to array instead.
		}
		let current = this.tokens[query[depth]];
		if(!current){
			return positions;
			//i-char is never followed by next char in the query string
			//this is very unlukely case, especially with text that not only language
		}

		let queryTokens = new Array<Token>();
		for (let i = 0; i < query.length; i++) {
			const glyph = this.tokens[query[i]];
			if(!glyph){
				return positions;
			}
			queryTokens.push(glyph);
		}
		
		let pos = start.firstPosition;
		while(pos != -1){
			current = queryTokens[depth];
			if(current.positions.get(pos + depth)){
				depth++;
				if(depth == query.length){
					//end of query - found a match
					positions.push(pos);
					pos = start.positions.get(pos) || -1;
					depth = 1;
				}
			} else {
				pos = start.positions.get(pos) || -1;
				depth = 1;
			}
		}
		return positions;
	}
}



class Token {
	constructor(public token: string, public firstPosition: number) {}
	positions = new Map<number, number>();
}




function test(){
	


	console.log("up and running");
	console.time("get_content");
	let content = document.body.textContent || "";
	console.timeEnd("get_content");
	console.time("build_index");
	const index = new Index().build(content);
	console.timeEnd("build_index");
	window.contentIndex = index;
	
	content = content.toLowerCase();

	console.time("index.playground");
	console.log("index 'playground'", index.getPositions("playground"));
	console.timeEnd("index.playground");


	
	let i = 0;
	let results = new Array<number>();
	console.time("search.playground");
	while((i = content.indexOf("playground", i + 1)) !== -1){
		results.push(i);
	}
	console.log("search 'playground'", results);
	console.timeEnd("search.playground");


	console.time("index.abstract");
	console.log("index. 'abstract'", index.getPositions("abstract"));
	console.timeEnd("index.abstract");

	i = 0;
	results = new Array<number>();
	console.time("search.abstract");
	while((i = content.indexOf("abstract", i + 1)) !== -1){
		results.push(i);
	}
	console.log("search 'abstract'", results);
	console.timeEnd("search.abstract");



	/* this take way too long
	console.time("using window.find: abstract");
	let count = 0;
	while(window.find("abstract", false, true, false, true, true, false)) {
		count++;
	}
	console.timeEnd("using window.find: abstract");
	console.log("abstract count: ", count);
	*/
}

window["test"] = test;

