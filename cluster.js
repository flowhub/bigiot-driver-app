
const fs = require('fs');

const densityClustering = require('density-clustering');

function validPosition(number) {
    return (Math.abs(number) >= 0.0 && Math.abs(number) <= 180.0); 
}

function clusterData(space) {

    let lat = 666.0;
    let lon = 666.0;

    if (typeof space.longitude == 'number') {
        [lat, lon] = [ space.latitude, space.longitude ];
    } else if (typeof space.location !== 'undefined' && typeof space.location.coordinates !== 'undefined') {
        [lat, lon] = space.location.coordinates;
    } else {
        return undefined;
    }

    //(s) -> [ s., ]
    if (!validPosition(lat)) {
        throw new Error('Postcondition failed: latitude is invalid');
    }
    if (!validPosition(lon)) {
        throw new Error('Postcondition failed: longitude is invalid');
    }
    return [ lat, lon ];
}

function dataExists(d) {
    return (typeof d !== 'undefined');
}


function clusterSpaces(spaces) {

    const radius = 0.0002;
    const nPoints = 2;

    const positions = spaces.map(clusterData);
    const dataset = positions.filter(dataExists);

    const missing = positions.length - dataset;
    if (missing > 0) {
        console.log(`Warning: dropped ${missing} parking spaces`);
    }

    const dbscan = new densityClustering.DBSCAN();
    const before = new Date().getTime();
    const clusters = dbscan.run(dataset, radius, nPoints);
    const after = new Date().getTime();

    console.log('clusters', clusters.length);
    console.log('noise', dbscan.noise.length);

    const executionTime = ((after-before)/1000.0);

    console.log(`clustering time ${executionTime}`);


    // Log as .CSV file
    lines = [];
    lines.push('latitude;longitude;cluster');
    for (var sampleIndex=0; sampleIndex<dataset.length; sampleIndex++) {

        let cluster = -1;
        for (var clusterId=0; clusterId<clusters.length; clusterId++) {
            const found = clusters[clusterId].indexOf(sampleIndex);
            if (found !== -1) {
                cluster = clusterId;
            }
        }

        const [lat, lon] = dataset[sampleIndex];

        const line = `${lat};${lon};${cluster}`;
        lines.push(line);
    }
    fs.writeFileSync('clusters.0002.n2.csv', lines.join('\n'));

}

function main() {
    const spaces = JSON.parse(fs.readFileSync('parkingspaces1.json')); 

    clusterSpaces(spaces);


}

if (!module.parent) {
    main();
}
