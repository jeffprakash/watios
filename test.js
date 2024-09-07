const l = [1, 2, 2, 3, 4, 5, 6, 7, 1, 7];

const map = {};

for (let i = 0; i < l.length; i++) {
    const element = l[i];

    if (map[element]) {
        map[element].count++;
        map[element].indices.push(i);
    } else {
        map[element] = {
            count: 1,
            indices: [i]
        };
    }

}

console.log(map);


const sortedKeys = Object.keys(map).filter(key => map[key].count > 1).sort((a, b) => {
    const indicesA = map[a].indices;
    const indicesB = map[b].indices;

    console.log('a:', a, 'b:', b);
    console.log('indicesA:', indicesA, 'indicesB:', indicesB);

    if (indicesA.length !== indicesB.length) {
        return indicesA.length - indicesB.length;
    }

    for (let i = 0; i < indicesA.length; i++) {
        if (indicesA[i] !== indicesB[i]) {
            return indicesA[i] - indicesB[i];
        }
    }

    return 0;
});

for (const key of sortedKeys) {
    console.log(key);
}
