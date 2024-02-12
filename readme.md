Little algo the find occurances of text on the page (in-page search).

For 1798k charapters long page takes *517ms* to build the index, and *~8ms* to find all hits.

Is it fast? Idk, but for sure it is memomy hungry (~40 MB)


built using vite and vue

run in broswer and open the console.

# How it works (if I remember correctly)

It creates a map of all characters that occur in the text and for each char stores the positions where this char occured.

To find the position of the search term we find the the the first charapter occures in the the text
and then check for the map of the second chraccter in check in escond char occures in char_1_pos+1 and so on.

For each char we him the position as s map object and the position of first occurance. For each key-value pair in the map key is the the position of the character and value is the next position of the same characted. (me many monthes later: the. what?)

for the text 'abstract' map for 'a' will look like this:

firstPosition: 0

map: [0 -> 5]


