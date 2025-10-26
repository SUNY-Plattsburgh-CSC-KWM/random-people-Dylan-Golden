async function getPeople() {
    try {
        const response = await fetch("https://randomuser.me/api/?results=25&nat=us");
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Could not get names: ${error}`);
    }
}


function TableStyles() {
    if ($('#peopleDashStyles').length) return;
    var css = `
        .my-table { width: 100%; border-collapse: collapse; border: 3px solid #f18705ff; background: #ffffff; }
        .my-table th, .my-table td { padding: 12px 14px; text-align: left; }
        .my-table thead th { background: #f3f4f6; font-weight: 700; }
        .my-table tbody tr { border-bottom: 1px solid #e5e7eb; }
    `;
    $('<style id="peopleDashStyles">').text(css).appendTo('head');
}

async function buildTable() {
    try {
        TableStyles(); 

        const data = await getPeople();

        var $dest = $('.my-table tbody');
        if (!$dest.length) $dest = $('.my-table');


        var rows = (data && data.results ? data.results : []).map(function (r) {
            var title = r?.name?.title || '';
            var first = r?.name?.first || '';
            var last  = r?.name?.last  || '';
            var name  = (title + ' ' + first + ' ' + last).trim();

            var addrNum  = r?.location?.street?.number || '';
            var addrName = r?.location?.street?.name   || '';
            var addr     = String(addrNum ? addrNum : '') + (addrNum ? ' ' : '') + String(addrName || '');

            var city  = r?.location?.city  || '';
            var state = r?.location?.state || '';
            var zip   = String(r?.location?.postcode ?? '');

            var lat = parseFloat(r?.location?.coordinates?.latitude  || 0);
            var lon = parseFloat(r?.location?.coordinates?.longitude || 0);

            var phone = r?.phone || r?.cell || '';

            return { name:name, addr:addr, city:city, state:state, zip:zip, lat:lat, lon:lon, phone:phone, last:last };
        });

        rows.sort(function (a, b) { return a.last.localeCompare(b.last); });

        $.each(rows, function (_, p) {
            var $tr = $('<tr>').attr('title', 'Phone: ' + p.phone);
            $tr.append($('<td>').text(p.name));
            $tr.append($('<td>').text(p.addr));
            $tr.append($('<td>').text(p.city));
            $tr.append($('<td>').text(p.state));
            $tr.append($('<td>').text(p.zip));
            $tr.append($('<td>').text(p.lat.toFixed(4)));
            $tr.append($('<td>').text(p.lon.toFixed(4)));
            $dest.append($tr);
        });

    } catch (e) {
        console.log("Error " + e);
    }
}

buildTable();

