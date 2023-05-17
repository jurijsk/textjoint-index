
class Index {
	alhabet = new Alphabet();

	getPositions = function getPositions(this: Index, query: string): number[]{
		let positions = new Array<number>();
		if(!query){
			return positions;
		}
		let depth = 0;
		let startGlyph = this.alhabet.glyphs[query[depth]];
		depth++;
		//let nextChar = ;
		if(query[depth] === undefined) {
			//end of query
			return positions; //return currentGlyph.positions to array instead.
		}
		let currentGlyph = this.alhabet.glyphs[query[depth]];
		if(!currentGlyph){
			return positions;
			//i-char is never followed by next char in the query string
			//this is very unlukely case, especially with text that not only language
		}

		let glyphs = new Array<Glyph>();
		for (let i = 0; i < query.length; i++) {
			const glyph = this.alhabet.glyphs[query[i]];
			if(!glyph){
				return positions;
			}
			glyphs.push(glyph);
		}
		let pos = startGlyph.firstPosition;
		while(pos != -1){
			currentGlyph = glyphs[depth];
			if(currentGlyph.positions.get(pos + depth)){
				depth++;
				if(depth == query.length){
					//end of query - found a match
					positions.push(pos);
					pos = startGlyph.positions.get(pos) || -1;
					depth = 1;
				}
			} else {
				pos = startGlyph.positions.get(pos) || -1;
				depth = 1;
			}
		}
		return positions;
	}
}

class Alphabet {
	glyphs: { [key: string]: Glyph } = {};

	getPositions(query: string){
		return this.glyphs[query[0]];
	}
}

class Glyph {
	constructor(public glyph: string, public firstPosition: number) {
	}
	//count = 0;
	positions = new Map<number, number>();
	//followers: { [key: string]: Glyph } = {};
}

const index = new Index();

function main(){
	console.log("up and running");

	console.time("get_content");
	let text = document.body.textContent || "";
	//let text = "abc ab";
	console.timeEnd("get_content");

	const alhabet = index.alhabet;
	let lastSeenIndex: {[key: string]: number} = {};
	console.time("index");
	let previous = new Glyph(text[0], 0);
	//previous.count++;
	previous.positions.set(0, 0);
	lastSeenIndex[text[0]] = 0; 
	alhabet.glyphs[text[0]] = previous;

	for (let i = 1; i < text.length; i++) {
		const char = text[i].toLowerCase();
		let glyph = alhabet.glyphs[char] || new Glyph(char, i);
		//glyph.count++;
		lastSeenIndex[char] !== undefined && (glyph.positions.set(lastSeenIndex[char], i));
		lastSeenIndex[char] = i;
		glyph.positions.set(i, -1);
		alhabet.glyphs[char] = glyph;
		//previous.followers[char] = glyph;
		previous = glyph;
	}
	console.timeEnd("index");

	console.log(alhabet);
	//document["aplha"] = alhabet;
}

main();


(function test(){


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

})()

