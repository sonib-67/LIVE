const fs = require('fs');
const editOld = fs.readFileSync('edit_hls_block.txt', 'utf8');

// The rest of the file we need to append
const marker = '              </div>\n\n              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">';
const idx = editOld.indexOf(marker);
if (idx !== -1) {
    const remaining = editOld.substring(idx);
    const mainCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
    
    // Check if the remaining part is already there
    if (!mainCode.includes(marker)) {
        fs.writeFileSync('src/pages/AdminDashboard.tsx', mainCode + "\n" + remaining);
        console.log('Appended successfully');
    } else {
        console.log('Already appended');
    }
} else {
    console.log('Marker not found');
}
