
class Index {
	tokens: { [key: string]: Token } = Object.create(null);

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



function buildIndex(){
	console.log("up and running");
	const index = new Index();

	console.time("get_content");
	let content = document.body.textContent || "";
	//let text = "abc ab";
	console.timeEnd("get_content");

	const tokens = index.tokens;
	let lastSeenIndex: {[key: string]: number} = {};
	console.time("index");
	let tokenSrt = content[0];
	let previous = new Token(tokenSrt, 0);
	previous.positions.set(0, 0);
	lastSeenIndex[content[0]] = 0; 
	tokens[content[0]] = previous;

	for (let i = 1; i < content.length; i++) {
		tokenSrt = content[i].toLowerCase();
		let token = tokens[tokenSrt] || new Token(tokenSrt, i);
		//glyph.count++;
		lastSeenIndex[tokenSrt] !== undefined && (token.positions.set(lastSeenIndex[tokenSrt], i));
		lastSeenIndex[tokenSrt] = i;
		token.positions.set(i, -1);
		tokens[tokenSrt] = token;
		//previous.followers[char] = glyph;
		previous = token;
	}
	console.timeEnd("index");

	return index;
}


function test(){
	


	let index = buildIndex();

	window.contentIndex = index;

	//console.log("includes 'a'", index.includes("a"));
	//console.log("includes 'abc'", index.includes("abc"));
	//console.log("includes 'az'", index.includes("az"));
	//console.log("includes 'jurijs'", index.includes("jurijs"));
	console.time("playground");
	console.log("includes 'playground'", index.getPositions("playground"));
	console.timeEnd("playground");
	console.time("abstract");
	console.log("includes 'abstract'", index.getPositions("abstract"));
	console.timeEnd("abstract");

	console.time("using window.find: abstract");
	let count = 0;
	while(window.find("abstract", false, true, false, true, true, false)) {
		count++;
	}
	console.timeEnd("using window.find: abstract");
	console.log("abstract count: ", count);
}

window["test"] = test;

