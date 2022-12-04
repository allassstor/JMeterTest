/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8543529411764705, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.584, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-70"], "isController": false}, {"data": [0.982, 500, 1500, "-30"], "isController": false}, {"data": [0.998, 500, 1500, "-31"], "isController": false}, {"data": [0.52, 500, 1500, "-10"], "isController": false}, {"data": [0.634, 500, 1500, "-33"], "isController": false}, {"data": [0.984, 500, 1500, "-34"], "isController": false}, {"data": [1.0, 500, 1500, "-36"], "isController": false}, {"data": [0.992, 500, 1500, "-37"], "isController": false}, {"data": [0.634, 500, 1500, "-38"], "isController": false}, {"data": [0.924, 500, 1500, "-17"], "isController": false}, {"data": [0.986, 500, 1500, "-18"], "isController": false}, {"data": [0.58, 500, 1500, "-19"], "isController": false}, {"data": [0.792, 500, 1500, "-1"], "isController": false}, {"data": [0.946, 500, 1500, "-2"], "isController": false}, {"data": [0.822, 500, 1500, "-3"], "isController": false}, {"data": [0.67, 500, 1500, "-4"], "isController": false}, {"data": [0.936, 500, 1500, "-5"], "isController": false}, {"data": [0.954, 500, 1500, "-6"], "isController": false}, {"data": [0.964, 500, 1500, "-7"], "isController": false}, {"data": [0.992, 500, 1500, "-8"], "isController": false}, {"data": [0.634, 500, 1500, "-20"], "isController": false}, {"data": [0.97, 500, 1500, "-9"], "isController": false}, {"data": [0.962, 500, 1500, "-21"], "isController": false}, {"data": [0.902, 500, 1500, "-22"], "isController": false}, {"data": [0.998, 500, 1500, "-23"], "isController": false}, {"data": [0.974, 500, 1500, "-24"], "isController": false}, {"data": [0.988, 500, 1500, "-46"], "isController": false}, {"data": [0.998, 500, 1500, "-27"], "isController": false}, {"data": [0.98, 500, 1500, "-28"], "isController": false}, {"data": [0.996, 500, 1500, "-29"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7500, 0, 0.0, 386.2285333333333, 10, 13364, 170.0, 757.0, 1071.8999999999996, 5875.3799999999865, 117.46096380636169, 850.5538651508982, 139.40001062042882], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 1000, 0, 0.0, 2896.7139999999963, 17, 27274, 555.0, 7557.7, 18131.04999999944, 21593.93, 15.606467320057433, 847.5671834033025, 138.91051373564207], "isController": true}, {"data": ["-70", 250, 0, 0.0, 36.21600000000001, 17, 327, 26.0, 56.900000000000006, 84.79999999999995, 289.01000000000045, 7.014393535534918, 1.1918989015459724, 6.699293825930811], "isController": false}, {"data": ["-30", 250, 0, 0.0, 128.05600000000007, 51, 623, 80.0, 371.70000000000005, 472.34999999999997, 547.4100000000001, 6.746727836999055, 3.3799525199028473, 66.66346899878559], "isController": false}, {"data": ["-31", 250, 0, 0.0, 92.136, 47, 513, 58.0, 132.8, 393.1999999999998, 474.7800000000002, 6.746727836999055, 3.3799525199028473, 12.31409602280394], "isController": false}, {"data": ["-10", 250, 0, 0.0, 2721.1599999999958, 153, 13364, 673.5, 11354.0, 12364.15, 13031.210000000001, 5.035956731059767, 68.67858777294886, 4.2274496152529055], "isController": false}, {"data": ["-33", 250, 0, 0.0, 720.9280000000002, 143, 4955, 649.5, 1206.1000000000001, 1321.6499999999996, 1708.780000000003, 6.627432267642225, 72.99101817241927, 6.1679130381475], "isController": false}, {"data": ["-34", 250, 0, 0.0, 72.73599999999999, 10, 779, 19.5, 161.60000000000002, 329.84999999999985, 750.7200000000003, 6.746545768566494, 2.793491607297064, 4.513070167449266], "isController": false}, {"data": ["-36", 250, 0, 0.0, 34.252000000000024, 17, 498, 24.0, 58.900000000000006, 85.34999999999997, 207.390000000001, 6.761873850481446, 1.148990283187277, 6.4515144061722385], "isController": false}, {"data": ["-37", 250, 0, 0.0, 117.08000000000003, 44, 753, 62.5, 261.8, 318.45, 632.0600000000009, 6.761508086763672, 4.50231919727376, 4.285369871396116], "isController": false}, {"data": ["-38", 250, 0, 0.0, 698.8239999999998, 155, 5160, 638.5, 1071.2, 1398.3999999999992, 2489.620000000006, 6.730743343294834, 100.02452514605713, 6.316644875885093], "isController": false}, {"data": ["-17", 250, 0, 0.0, 273.8240000000001, 98, 2286, 167.5, 574.8, 720.5999999999997, 1879.1200000000008, 5.794682799063579, 167.18488333854856, 4.643668657140208], "isController": false}, {"data": ["-18", 250, 0, 0.0, 76.61199999999994, 10, 1057, 21.5, 174.8, 323.2999999999996, 784.5400000000004, 5.8245188947392945, 2.411714854852989, 3.7313324169423607], "isController": false}, {"data": ["-19", 250, 0, 0.0, 889.4680000000002, 161, 5522, 674.0, 1322.9, 2294.2999999999993, 5161.010000000002, 5.832264084917765, 79.13455124373031, 4.6760632946459815], "isController": false}, {"data": ["-1", 250, 0, 0.0, 1204.9680000000003, 34, 7893, 49.0, 5869.8, 7036.95, 7694.31, 4.307893784570847, 2.6251227749728603, 3.3739558742439644], "isController": false}, {"data": ["-2", 250, 0, 0.0, 271.98, 161, 1663, 180.5, 542.1000000000001, 844.5999999999999, 1255.8600000000001, 5.027146591594611, 6.862094372109391, 2.96032167454253], "isController": false}, {"data": ["-3", 250, 0, 0.0, 408.05999999999983, 170, 2799, 196.0, 868.8, 921.5999999999999, 1949.1000000000026, 4.947947591339113, 4.168877780746546, 1.7540087652891578], "isController": false}, {"data": ["-4", 250, 0, 0.0, 662.1879999999994, 247, 2144, 550.0, 1080.8, 1632.5, 1917.860000000001, 5.002501250625312, 206.42061265007504, 2.481709604802401], "isController": false}, {"data": ["-5", 250, 0, 0.0, 260.3320000000001, 169, 2368, 188.5, 544.7, 632.2499999999998, 1174.780000000002, 5.010321261799307, 4.003148830340502, 1.7663339604585446], "isController": false}, {"data": ["-6", 250, 0, 0.0, 263.08399999999995, 163, 1249, 182.5, 435.5000000000001, 780.9, 913.7800000000002, 5.027348777348777, 6.904317298604408, 2.8917074510336227], "isController": false}, {"data": ["-7", 250, 0, 0.0, 251.06000000000006, 161, 1225, 183.0, 384.30000000000007, 737.9499999999998, 1119.5200000000004, 5.0343341589641355, 6.866654804516805, 2.959637855172275], "isController": false}, {"data": ["-8", 250, 0, 0.0, 99.28, 23, 561, 37.0, 310.6000000000001, 411.79999999999995, 524.6200000000003, 5.054589567327133, 1.480836787302871, 3.320036077133037], "isController": false}, {"data": ["-20", 250, 0, 0.0, 823.7919999999999, 228, 3624, 537.5, 1660.9, 2016.7499999999993, 3512.3900000000012, 5.753077896674721, 249.20596288545622, 3.101268553676217], "isController": false}, {"data": ["-9", 250, 0, 0.0, 266.964, 169, 1945, 188.0, 374.9, 811.5999999999992, 1216.0500000000013, 5.062470890792378, 7.553364771277565, 3.12943757214021], "isController": false}, {"data": ["-21", 250, 0, 0.0, 216.044, 86, 1037, 107.0, 452.8, 629.8, 953.0200000000009, 6.609210595886427, 4.38892891133083, 3.7434981890762966], "isController": false}, {"data": ["-22", 250, 0, 0.0, 352.24800000000005, 119, 5080, 242.5, 638.3000000000001, 869.5999999999999, 1363.410000000002, 6.652297703626833, 210.04580626679703, 5.554408727149357], "isController": false}, {"data": ["-23", 250, 0, 0.0, 54.06399999999999, 22, 745, 32.0, 98.0, 122.89999999999998, 388.13000000000034, 6.670580073643204, 1.9542715059501574, 4.911735718288062], "isController": false}, {"data": ["-24", 250, 0, 0.0, 148.03999999999994, 34, 1274, 80.0, 394.40000000000003, 507.79999999999995, 830.1400000000008, 6.6711140760507, 31.49151517678452, 3.3681308372248164], "isController": false}, {"data": ["-46", 250, 0, 0.0, 50.81600000000002, 10, 2694, 17.0, 59.50000000000003, 97.0, 721.4300000000019, 7.014590347923681, 2.904478815937149, 4.7540290053310885], "isController": false}, {"data": ["-27", 250, 0, 0.0, 134.8879999999999, 85, 571, 97.5, 330.9000000000009, 385.69999999999993, 483.7600000000002, 6.697564765451282, 4.447601602057492, 3.8197049052964345], "isController": false}, {"data": ["-28", 250, 0, 0.0, 157.85599999999994, 91, 2473, 103.0, 231.9, 427.9499999999999, 995.2000000000053, 6.73781802501078, 6.178184334909983, 12.468911286518974], "isController": false}, {"data": ["-29", 250, 0, 0.0, 99.90000000000002, 49, 885, 61.0, 151.70000000000002, 404.4999999999999, 548.410000000001, 6.70942808834975, 3.3612662200424035, 29.78619149378707], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7500, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
