// Campus Data with real coordinates
// Campus Data with real coordinates and boundaries
const campusData = {
    iba: {
        name: "Iba Campus",
        center: { lat: 15.318547, lng: 119.98376 },
        zoom: 16,
        boundary: [
            [15.319557427098843, 119.98532279621844],  // Point 1 - Starting point (East side)
            [15.319581842835973, 119.98526771782667],  // Point 2
            [15.319643774836472, 119.98521915685589],  // Point 3
            [15.31971780828745, 119.98516898928784],   // Point 4
            [15.319767402217138, 119.98514511609602],  // Point 5
            [15.319885547520414, 119.98501618965793],  // Point 6
            [15.319899203673842, 119.98499385044124],  // Point 7
            [15.319951885444032, 119.98490989340732],  // Point 8
            [15.320001150019689, 119.98483067534404],  // Point 9
            [15.3201031414007, 119.98467448539415],    // Point 10
            [15.320300021009217, 119.98436592733788],  // Point 11 (Northeast corner)
            [15.320143509927242, 119.98421012726033],  // Point 12
            [15.319993516357215, 119.98406376469012],  // Point 13
            [15.319891613713715, 119.98387404344285],  // Point 14
            [15.319803100064348, 119.98370659533941],  // Point 15
            [15.31957193799758, 119.98326787274604],   // Point 16
            [15.319414921924249, 119.98307625543697],  // Point 17
            [15.319336411646743, 119.98297957932228],  // Point 18
            [15.319330802220644, 119.98293956905079],  // Point 19
            [15.31932169670889, 119.98289340608454],   // Point 20
            [15.319311023652418, 119.98283016872233],  // Point 21
            [15.319406352073202, 119.98219752507367],  // Point 22
            [15.319375457793342, 119.98175711624634],  // Point 23 (Northwest area)
            [15.319375629988386, 119.98175702039657],  // Point 24
            [15.31907771829789, 119.98169313150026],   // Point 25
            [15.318320492398513, 119.98162517449401],  // Point 26
            [15.318050634503166, 119.98177935199033],  // Point 27
            [15.317888189745446, 119.98174229175828],  // Point 28
            [15.317856138349882, 119.98173419920636],  // Point 29
            [15.31779006893953, 119.98171769353934],   // Point 30 (Southwest corner)
            [15.316818355118315, 119.98284506255612],  // Point 31
            [15.31676969491052, 119.98289862478788],   // Point 32
            [15.316722132713025, 119.98295182453586],  // Point 33
            [15.316466765915976, 119.98325457923119],  // Point 34
            [15.31647518298493, 119.98330105137191],   // Point 35
            [15.31649210640515, 119.98331861596108],   // Point 36
            [15.316646938600087, 119.98347111085195],  // Point 37 (South area)
            [15.317942142616204, 119.98474499859955],  // Point 38
            [15.319265545365212, 119.98598825258756],  // Point 39 (Southeast corner)
            [15.319265579992091, 119.98598712688607],  // Point 40
            [15.319360088441343, 119.98578774798978],  // Point 41
            [15.319361441453708, 119.98578590493827],  // Point 42
            [15.31955743217236, 119.98532335566506],   // Point 43
            [15.319557427098843, 119.98532279621844]   // Point 44 - Closing point (same as Point 1)
        ],
        locations: [
            { 
                id: 1,
                name: "Computing and Technology Building",
                shortName: "CCIT",
                labelOffset: [0, 0, 41],
                type: "department", 
                coords: [15.316989, 119.983176],
                description: "A facility that houses computer laboratories, classrooms, and faculty offices for technology-based learning, practical training, and computing-related programs.",
                photo: "images/building images/ccit.webp",
                image: "images/building images/ccit.webp",
                rooms: [                 
                    { id: 101, name: "SBO Office", coords: [15.3175769, 119.9822234], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "CCIT Room 5", coords: [15.3175417, 119.9822626], floor: "Ground Floor", iconOffset: [0, 0], instructor: "Mr. Joseph J. Juliano" },
                    { id: 103, name: "CCIT Room 4", coords: [15.3175065, 119.9823017], floor: "Ground Floor", iconOffset: [0, 0], instructor: "Mr. Daniel A. Bachillar" },
                    { id: 104, name: "CCIT Room 3", coords: [15.3174713, 119.9823409], floor: "Ground Floor", iconOffset: [0, 0], instructor: "Mr. Hansel S. Ada" },
                    { id: 105, name: "CCIT Room 2", coords: [15.3174361, 119.9823801], floor: "Ground Floor", iconOffset: [0, 0], instructor: "Engr. Melojean C. Marave" },
                    { id: 106, name: "CCIT Room 1", coords: [15.3174009, 119.9824192], floor: "Ground Floor", iconOffset: [0, 0], instructor: "Mr. Israel M. Cabasug" },

                    { id: 107, name: "CCIT Room 11", coords: [15.3175407, 119.9821884], floor: "2nd Floor", iconOffset: [0, 0], instructor: "Mr. Jason S. Artates" },
                    { id: 108, name: "CCIT Room 10", coords: [15.3175055, 119.9822276], floor: "2nd Floor", iconOffset: [0, 0], instructor: "Mr. Darwin Moraña" },
                    { id: 109, name: "CCIT Room 9", coords: [15.3174703, 119.9822668], floor: "2nd Floor", iconOffset: [0, 0], instructor: "Mr. Jiel M. Dullas Jr." },
                    { id: 110, name: "CCIT Room 8", coords: [15.3174351, 119.9823059], floor: "2nd Floor", iconOffset: [0, 0], instructor: "Mr. Daryll John C. Ragadio" },
                    { id: 111, name: "CCIT Room 7", coords: [15.3173999, 119.9823451], floor: "2nd Floor", iconOffset: [0, 0], instructor: "Dr. Geoffrey S. Sepillo" },
                    { id: 112, name: "CCIT Room 6", coords: [15.3173647, 119.9823843], floor: "2nd Floor", iconOffset: [0, 0], instructor: "Engr. Carl Angelo S. Pamplona" },

                    { id: 113, name: "Storage Room", coords: [15.3168879, 119.9832220], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 114, name: "Faculty Office", coords: [15.3169079, 119.9831990], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 115, name: "Programs Chair’s Office", coords: [15.3169279, 119.9831760], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 116, name: "Multi Media Center", coords: [15.3169478, 119.9831530], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 117, name: "Dean’s Office", coords: [15.3169678, 119.9831300], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 118, name: "Storage Room", coords: [15.3169878, 119.9831070], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 119, name: "Comfort Room (F/M)", coords: [15.3170078, 119.9830841], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 120, name: "Programs Chair’s Office", coords: [15.3170278, 119.9830611], floor: "Ground Floor", iconOffset: [0, 0] },

                    { id: 201, name: "Hybrid Laboratory 1", coords: [15.3169190, 119.9832510], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "Computer Laboratory 1", coords: [15.3169469, 119.9832188], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "Hybrid Laboratory 2", coords: [15.3169749, 119.9831866], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "Laboratory Custodian Office", coords: [15.3170029, 119.9831544], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 205, name: "Comfort Room (F/M)", coords: [15.3170308, 119.9831223], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 206, name: "Faculty", coords: [15.3170588, 119.9830901], floor: "2nd Floor", iconOffset: [0, 0] },

                    { id: 301, name: "Hybrid Laboratory 3", coords: [15.3169500, 119.9832800], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 302, name: "Computer Laboratory 3", coords: [15.3169780, 119.9832478], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 303, name: "Computer Laboratory 2", coords: [15.3170060, 119.9832156], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 304, name: "Extension Office", coords: [15.3170339, 119.9831834], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 305, name: "Comfort Room (F/M)", coords: [15.3170619, 119.9831512], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 306, name: "Faculty", coords: [15.3170899, 119.9831191], floor: "3rd Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 2,
                name: "College of Nursing Building",
                shortName: "CON",
                labelOffset: [0, 0, 41],
                type: "department",
                coords: [15.317352, 119.982491],
                description: "A facility that houses classrooms, nursing laboratories, simulation rooms, and faculty offices to support nursing education, clinical skills training, and healthcare-related learning.",
                photo: "images/building images/nursing.webp",
                image: "images/building images/nursing.webp",
                rooms: [
                    { id: 201, name: "Lecture Room 6", coords: [15.3172647, 119.9824843], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "Lecture Room 5", coords: [15.3172220, 119.9825332], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "Lecture Room 4", coords: [15.3171794, 119.9825822], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "Lecture Room 3", coords: [15.3171367, 119.9826311], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 205, name: "Lecture Room 2", coords: [15.3170940, 119.9826800], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 206, name: "Lecture Room 1", coords: [15.3170513, 119.9827289], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 207, name: "CSBO Office", coords: [15.3170086, 119.9827778], floor: "2nd Floor", iconOffset: [0, 0] },

                    { id: 101, name: "Dean’s Office/Faculty Room", coords: [15.3170499, 119.9828165], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "Science Laboratory", coords: [15.3171352, 119.9827186], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "Old Skill Laboratory", coords: [15.3172206, 119.9826208], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "Accreditation Room", coords: [15.3173059, 119.9825230], floor: "Ground Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 3,
                name: "College of Engineering Building",             
                shortName: "COE",
                labelOffset: [0, 0, 41],
                type: "department",
                coords: [15.317704, 119.982067],
                description:"Develops skilled engineers equipped for innovation, problem-solving, and technological advancement.",
                photo: "images/building images/coe.webp",
                image: "images/building images/coe.webp",
                rooms: [
                    { id: 101, name: "COE 103 CMR&SOIL Mechanics Laboratory", coords: [15.3176366, 119.9821574], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "COE 102 Hydraulics Laboratory", coords: [15.3176776, 119.9821138], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "Civil Engineering Department Faculty Room", coords: [15.3177186, 119.9820701], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "Comfort Room (F/M)", coords: [15.3177597, 119.9820265], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 105, name: "Storage Room", coords: [15.3178007, 119.9819829], floor: "Ground Floor", iconOffset: [0, 0] },
                    
                    { id: 201, name: "COE Computer Laboratory", coords: [15.3177712, 119.9819530], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "COE 201 Classroom", coords: [15.3177165, 119.9820112], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "COE 202 Classroom", coords: [15.3176617, 119.9820694], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "COE 203 Classroom", coords: [15.3176070, 119.9821276], floor: "2nd Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 4,
                name: "Gymnasium",
                shortName: "GYMNASIUM",
                labelOffset: [0, 0, 0],
                type: "facilities",
                coords: [15.318174, 119.982318],
                description: "Indoor basketball court, fitness center, and sports facilities",
                photo: "images/building images/gym.webp",
                image: "images/building images/gym.webp",
                rooms: [
                    {id: 101, name: "Faculty Room P.E Department", coords: [15.31841, 119.98239], floor: "1st Floor", iconOffset: [-5, 0] },
                    {id: 102, name: "BPED 1B", coords: [15.31802, 119.982179], floor: "1st Floor", iconOffset: [0, 0] },
                    
                    {id: 103, name: "BPED", coords: [15.3179249, 119.9824221], floor: "1st Floor", iconOffset: [0, 0] },
                    {id: 104, name: "BPED", coords: [15.3179253, 119.9822960], floor: "1st Floor", iconOffset: [0, 0] },
                    {id: 105, name: "BPED", coords: [15.318018, 119.982428], floor: "1st Floor", iconOffset: [0, 0] },
                    
                    {id: 106, name: "Comfort Room (F/M)", coords: [15.3179257, 119.9821699], floor: "1st Floor", iconOffset: [0, 0] },

                    {id: 201, name: "NSTP Office", coords: [15.31836, 119.98239], floor: "2nd Floor", iconOffset: [-5, 0] },
                    {id: 202, name: "Crim P.E Area", coords: [15.31836, 119.98232], floor: "2nd Floor", iconOffset: [-5, 0] },
                    {id: 203, name: "CRIM Scene Room Station 3", coords: [15.31836, 119.98225], floor: "2nd Floor", iconOffset: [-5, 0] },
                    {id: 204, name: "Comfort Room (F/M)", coords: [15.31836, 119.98218], floor: "2nd Floor", iconOffset: [-5, 0] },
                ]
            },
            {
                id: 5,
                name: "Science and Engineering Laboratory Building",               
                shortName: "SELB",
                labelOffset: [0, 0, -86],
                type: "department",
                coords: [15.318643, 119.981875],
                description: "Supports research, experiments, and practical learning in science and engineering disciplines.",
                photo: "images/building images/selb.webp",
                image: "images/building images/selb.webp",
                rooms: [
                    { id: 100, name: "SELB 100 Dean’s Office", coords: [15.3183195, 119.9818744], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 101, name: "SELB 101 Mechanical Engineering Department", coords: [15.3183853, 119.9818794], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "SELB 102 Audio Visual Room", coords: [15.3184512, 119.9818845], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "SELB 103 Mechanical Engineering Laboratory Room 1", coords: [15.3185170, 119.9818896], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "SELB 104 Mechanical Engineering Laboratory Room 2", coords: [15.3185828, 119.9818946], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 105, name: "Comfort Room", coords: [15.3186486, 119.9818997], floor: "Ground Floor", iconOffset: [0, 0] },
                    
                    { id: 205, name: "SELB 205 Electrical Engineering Department", coords: [15.3183217, 119.9818440], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "SELB 204 Physical Lab", coords: [15.3183875, 119.9818491], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "SELB 203 EE and ECE Laboratory Room", coords: [15.3184533, 119.9818541], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "SELB 202 Electrical Engineering Laboratory Room 2", coords: [15.3185192, 119.9818592], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 201, name: "SELB 201 Electrical Engineering Laboratory Room 1", coords: [15.3185850, 119.9818643], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 206, name: "Comfort Room", coords: [15.3186508, 119.9818694], floor: "2nd Floor", iconOffset: [0, 0] },
                    
                    { id: 301, name: "SELB 301 Computer Engineering Department", coords: [15.3183239, 119.9818137], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 302, name: "SELB 302A Software Engineering Laboratory Room", coords: [15.3183897, 119.9818187], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 303, name: "SELB 303B Networking Laboratory Room", coords: [15.3184555, 119.9818238], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 304, name: "SELB 304 Chemistry Laboratory Room", coords: [15.3185213, 119.9818289], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 305, name: "SELB 305 Digital Electronics Laboratory Room", coords: [15.3185872, 119.9818339], floor: "3rd Floor", iconOffset: [0, 0]},
                    { id: 306, name: "Comfort Room", coords: [15.3186530, 119.9818390], floor: "3rd Floor", iconOffset: [0, 0] }
                ]
            },
            {
                id: 6,  
                name: "College of Business, Accountancy, and Public Administration Building",
                shortName: "CBAPA",
                labelOffset: [0, 0, 11],
                type: "department",
                coords: [15.319194, 119.982286],
                description: "A facility that houses classrooms, faculty offices, and learning spaces for business, accountancy, and public administration programs.",
                photo: "images/building images/cbapa.webp",
                image: "images/building images/cbapa.webp",
                rooms: [
                    { id: 101, name: "Comfort Room", coords: [15.3191983, 119.9821571], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "CBAPA Faculty", coords: [15.3191862, 119.9822152], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "CBAPA Room 101", coords: [15.3191742, 119.9822734], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "CBAPA ROOM 102", coords: [15.3191621, 119.9823316], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 105, name: "Research Office", coords: [15.3191501, 119.9823898], floor: "Ground Floor", iconOffset: [0, 0] },

                    { id: 201, name: "Supply Room", coords: [15.3192273, 119.9821635], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "CBAPA Room 203", coords: [15.3192153, 119.9822217], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "CBAPA Room 202", coords: [15.3192032, 119.9822799], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "CBAPA ROOM 201", coords: [15.3191912, 119.9823381], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 205, name: "Accreditation Room", coords: [15.3191791, 119.9823962], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 301, name: "Comfort Room", coords: [15.3192564, 119.9821700], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 302, name: "CBAPA AVR", coords: [15.3192443, 119.9822282], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 303, name: "CBAPA Room 301", coords: [15.3192322, 119.9822863], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 304, name: "CBAPA ROOM 302", coords: [15.3192202, 119.9823445], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 305, name: "Extension Service Office", coords: [15.3192081, 119.9824027], floor: "3rd Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 7,
                name: "College of Law Building",
                shortName: "LAW",
                labelOffset: [0, 0, 12],
                type: "department",
                coords: [15.319075, 119.982991],
                description: "A facility that houses classrooms, faculty offices, and learning spaces for legal education, research, and law-related academic activities.",
                photo: "images/building images/law.webp",
                image: "images/building images/law.webp",
                rooms: []
            },
            {
                id: 8,
                name: "Administration Building",
                shortName: "ADMIN BLDG.",
                labelOffset: [0, 0, 36],
                type: "administration",
                coords: [15.318348, 119.983544],
                description: "Main administrative building of PRMSU housing key offices and academic departments",
                photo: "images/building images/admin.webp",
                image: "images/building images/admin.webp",
                rooms: [
                    { id: 101, name: "Collecting and Disbursing Office", coords: [15.3184982, 119.9834692], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "Office of the Resident Auditor", coords: [15.3184727, 119.9835036], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "Cashier", coords: [15.3184471, 119.9835380], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "Budgeting Services Office", coords: [15.3184216, 119.9835724], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 105, name: "Human Resources Management Office", coords: [15.3183961, 119.9836068], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 106, name: "Accounting Services Office", coords: [15.3183705, 119.9836412], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 107, name: "Chief Administrative Officer Director, Admin Services", coords: [15.3183450, 119.9836756], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 108, name: "Comfort Room", coords: [15.3183194, 119.9837100], floor: "Ground Floor", iconOffset: [0, 0] },

                    { id: 201, name: "Procurement Management Office", coords: [15.3184620, 119.9834403], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "Office of the Vice President for Planning and Quality Management", coords: [15.3184365, 119.9834747], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "Office of the Vice President for Academic Affairs", coords: [15.3184109, 119.9835091], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "Office of the Vice President for Research and Development", coords: [15.3183854, 119.9835435], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 205, name: "Office of the University President", coords: [15.3183598, 119.9835779], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 206, name: "Office of the Vice President for Administration and Finance", coords: [15.3183343, 119.9836123], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 207, name: "Office of the University and Board Secretary", coords: [15.3183087, 119.9836467], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 208, name: "Interview Room", coords: [15.3182832, 119.9836811], floor: "2nd Floor", iconOffset: [0, 0] },

                    { id: 301, name: "Information & Communications Technology Office", coords: [15.3184258, 119.9834114], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 302, name: "Internal Audit Services Office", coords: [15.3183960, 119.9834515], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 303, name: "Futures Thinking Innovation Workspace", coords: [15.3183662, 119.9834917], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 304, name: "Statistical Services Intellectual Property Service Office", coords: [15.3183364, 119.9835318], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 305, name: "Office of the University and Board Secretary (Records Room)", coords: [15.3183066, 119.9835719], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 306, name: "Research and Development, Extension and Production Services Office", coords: [15.3182768, 119.9836121], floor: "3rd Floor", iconOffset: [0, 0] },
                    { id: 307, name: "Project Development Office", coords: [15.3182470, 119.9836522], floor: "3rd Floor", iconOffset: [0, 0] },

                    { id: 401, name: "Records Management Services Office", coords: [15.3183001, 119.9835029], floor: "4th Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 9,
                name: "President Ramon Magsaysay Statue PRMSU",
                shortName: "STATUE",
                labelOffset: [0, 0, 36],
                type: "landmark",
                coords: [15.318538, 119.983757],
                description: "A commemorative statue honoring President Ramon Magsaysay, symbolizing leadership and integrity at PRMSU.",
                photo: "images/building images/statue.webp",
                image: "images/building images/statue.webp",
            },
            {
                id: 10,
                name: "Registrar Building",
                shortName: "REGISTRAR",
                labelOffset: [0, 0, -55],
                type: "administration",
                coords: [15.318755, 119.984371],
                description: "Building dedicated to student records, enrollment, and academic documentation services.",
                photo: "images/building images/registrar.webp",
                image: "images/building images/registrar.webp",
                rooms: ["Registrar’s Office", "Records Section", "Evaluation Room", "Releasing Section", "Waiting Area"]
            },
            {
                id: 11,
                name: "E-Library",
                shortName: "LIBRARY",
                labelOffset: [0, 0, -52],
                type: "facilities",
                coords: [15.318796, 119.984987],
                description: "Digital library providing online resources, study spaces, and computer access for students and faculty.",
                photo: "images/building images/e-library.webp",
                image: "images/building images/e-library.webp",
                rooms: ["Computer Section", "Reading Area", "Discussion Room", "Faculty Resource Area", "Printing and Scanning Section"]
            },
            {
                id: 12,
                name: "College of Tourism and Hospitality Management",
                shortName: "CTHM",
                labelOffset: [0, 0, 35],
                type: "department",
                coords: [15.319661, 119.984356],
                description: "Academic building for Tourism and Hospitality programs, featuring training laboratories and classrooms..",
                photo: "images/building images/cthm.webp",
                image: "images/building images/cthm.webp",
                rooms: [
                    { id: 101, name: "Dean’s Office", coords: [15.3197790, 119.9842237], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 102, name: "CTHM Room 107 & CTHM AVR Room", coords: [15.3197183, 119.9843089], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "CTHM Room 109", coords: [15.3196577, 119.9843940], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "CTHM Room 110", coords: [15.3195970, 119.9844791], floor: "Ground Floor", iconOffset: [0, 0] },

                    { id: 105, name: "Office of the Campus Director", coords: [15.3195364, 119.9845642], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 106, name: "CTHM DID Room", coords: [15.3194757, 119.9846493], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 107, name: "CTHM Room 102", coords: [15.3194151, 119.9847344], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 108, name: "CTHM Room 103", coords: [15.3193544, 119.9848195], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 109, name: "CBAPA Faculty Room", coords: [15.3192938, 119.9849046], floor: "Ground Floor", iconOffset: [0, 0] },

                    { id: 201, name: "CTHM Room 212", coords: [15.3197470, 119.9841992], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 202, name: "CTHM Room 211", coords: [15.3197029, 119.9842611], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 203, name: "CTHM Room 210", coords: [15.3196588, 119.9843230], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 204, name: "CTHM Room 209", coords: [15.3196147, 119.9843849], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 205, name: "CTHM Room 208", coords: [15.3195706, 119.9844468], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 206, name: "CTHM Room 207", coords: [15.3195265, 119.9845087], floor: "2nd Floor", iconOffset: [0, 0] },

                    { id: 207, name: "CTHM Room 206", coords: [15.3194823, 119.9845706], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 208, name: "CTHM Room 205", coords: [15.3194382, 119.9846325], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 209, name: "CTHM Room 204", coords: [15.3193941, 119.9846944], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 210, name: "CTHM Room 203", coords: [15.3193500, 119.9847563], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 211, name: "CTHM Room 202", coords: [15.3193059, 119.9848182], floor: "2nd Floor", iconOffset: [0, 0] },
                    { id: 212, name: "CTHM Room 201", coords: [15.3192618, 119.9848801], floor: "2nd Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 13,
                name: "Gender and Development Center",
                shortName: "GAD Office",
                labelOffset: [0, 0, -55],
                type: "office",
                coords: [15.319542, 119.984151],
                description: "Office promoting gender equality, women empowerment, and inclusive development programs within PRMSU.",
                photo: "images/building images/gad.webp",
                image: "images/building images/gad.webp",
                rooms: ["GAD Coordinator’s Office", "Training and Seminar Room", "Counseling Room", "Resource Center", "Staff Office"]
            },
            {
                id: 14,
                name: "Cafeteria",
                shortName: "CAFETERIA",
                labelOffset: [0, 0, -55],
                type: "facilities",
                coords: [15.319244, 119.983925],
                description: "Campus dining facility offering a variety of food and beverage options for students and staff.",
                photo: "images/building images/cafeteria.webp",
                image: "images/building images/cafeteria.webp",
                rooms: ["Dining Area", "Food Service Counter", "Beverage Station", "Seating Area"]
            },
            {
                id: 15,
                name: "College of Industrial Technology",
                shortName: "CIT",
                labelOffset: [0, 0, 5],
                type: "department",
                coords: [15.317652, 119.983644],
                description: "Building housing programs in Industrial Technology, including workshops and laboratories.",
                photo: "images/building images/cit.webp",
                image: "images/building images/cit.webp",
                rooms: [
                    {id: 101, name: "Research and Extension Office", coords: [15.31771, 119.98359], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102, name: "Electronics Technology", coords: [15.31770, 119.98369], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 103, name: "Office of the Dean", coords: [], floor: "Ground Floor", iconOffset: [], instructor: "Dr. Lorna L. Acuavera" }
                ]
            },
            {
                id: 16,
                name: "College of Teacher Education Building",
                shortName: "CTE",
                labelOffset: [0, 0, -55],
                type: "department",
                coords: [15.318327, 119.984996],
                description: "Building for education programs, housing classrooms, faculty offices, and learning laboratories for future teachers.",
                photo: "images/building images/cte.webp",
                image: "images/building images/cte.webp",
                rooms: [
                    {id: 101, name: "Comfort Room", coords: [15.3184439, 119.9851137], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102, name: "CTE 101", coords: [15.3183984, 119.9850760], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 103, name: "CTE 102", coords: [15.3183529, 119.9850383], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 104, name: "CTE 103", coords: [15.3183074, 119.9850006], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 105, name: "CTE 104", coords: [15.3182619, 119.9849629], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 106, name: "CTE 105", coords: [15.3182164, 119.9849252], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 107, name: "CTE 106", coords: [15.3181709, 119.9848875], floor: "Ground Floor", iconOffset: [0, 0] },

                    {id: 201, name: "CTE 201", coords: [15.3184731, 119.9850758], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 202, name: "CTE 202", coords: [15.3184185, 119.9850305], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 203, name: "CTE 203", coords: [15.3183639, 119.9849853], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 204, name: "CTE 204", coords: [15.3183093, 119.9849400], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 205, name: "CTE 205", coords: [15.3182547, 119.9848948], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 206, name: "CTE 206", coords: [15.3182001, 119.9848496], floor: "2nd Floor", iconOffset: [0, 0] }
                ]
            },
            {
                id: 17,
                name: "University Health Clinic / Supply Office",
                shortName: "CLINIC",
                labelOffset: [0, 0, 36],
                type: "facilities",
                coords: [15.318522, 119.984191],
                description: "A facility that provides basic medical services, health consultations, and first aid while also managing and distributing school supplies and materials.",
                photo: "images/building images/clinic.webp",
                image: "images/building images/clinic.webp",
                rooms: ["Reception Area", "Doctor’s Office", "Dental Room", "Treatment Room", "Pharmacy", "Waiting Area"]
            },
            {
                id: 18,
                name: "Front Gate",
                shortName: "Front Gate",
                labelOffset: [0, 0, 34],
                type: "landmark",
                coords: [15.319977, 119.984796],
                description: "Main entrance of PRMSU Iba Campus, serving as the primary access point for students, faculty, and visitors.",
                photo: "images/building images/frontG.webp",
                image: "images/building images/frontG.webp",
                rooms: []
            },
            {
                id: 19,
                name: "Exit Gate",
                shortName: "Exit Gate",
                labelOffset: [0, 0, -46],
                type: "landmark",
                coords: [15.316515, 119.983328],
                description: "Designated exit point of PRMSU Iba Campus for vehicles and pedestrians, ensuring smooth campus traffic flow.",
                photo: "images/building images/exitG.webp",
                image: "images/building images/exitG.webp",
                rooms: []
            },
            {
                id: 20,
                name: "Dormitory",
                shortName: "Prmsu Dormitory",
                labelOffset: [0, 0, -47],
                type: "facilities",
                coords: [15.317008, 119.983673],
                description: "On-campus housing facility providing safe and comfortable accommodation for PRMSU students.",
                photo: "images/building images/dorm.webp",
                image: "images/building images/dorm.webp",
                rooms: ["Single Room", "Double Room", "Common Area", "Laundry Room", "Study Room"]
            },
            {
                id: 21,
                name: "New Gymnasium",
                shortName: "NEW GYMNASIUM",
                labelOffset: [0, 0, 0],
                type: "facilities",
                coords: [15.318161, 119.982876],
                description: "A modern multi-purpose facility used for sports, physical education classes, large school events, athletic competitions, and other recreational activities.",
                photo: "images/building images/newgym.webp",
                image: "images/building images/newgym.webp",
                rooms: []
            },
            {
                id: 22,
                name: "College of Accountancy and Business Administration",
                shortName: "CABA",
                labelOffset: [0, 0, 35],
                type: "department",
                coords: [15.319393, 119.984726],
                description: "Academic building offering programs in Accountancy, Business Administration, and related business fields.",
                photo: "images/building images/caba.webp",
                image: "images/building images/caba.webp",
                rooms: []
            },
            {
                id: 23,
                name: "Cooperative Canteen",
                shortName: "COOP",
                labelOffset: [0, 0, 38],
                type: "facilities",
                coords: [15.319727, 119.985073],
                description: "Campus cooperative providing essential goods and services to students and staff at affordable prices.",
                photo: "images/building images/coop.webp",
                image: "images/building images/coop.webp",
                rooms: ["Sales Area", "Office", "Storage Room", "Customer Service Desk"]
            },
            {
                id: 24,
                name: "CAS Annex [Antonio M. DIAZ Hall]",
                shortName: "ANNEX",
                labelOffset: [0, 0, -55],
                type: "department",
                coords: [15.319022, 119.984558],
                description: "Additional administrative building supporting various university functions and services.",
                photo: "images/building images/annex.webp",
                image: "images/building images/annex.webp",
                rooms: [
                    {id: 101, name: "CASA 101", coords: [15.3191640, 119.9846910], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102, name: "CASA 102", coords: [15.3190654, 119.9846196], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 103, name: "CASA 103", coords: [15.3189668, 119.9845481], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 104, name: "CASA 104", coords: [15.3188682, 119.9844767], floor: "Ground Floor", iconOffset: [0, 0] },

                    {id: 201, name: "CASAnnex 201", coords: [15.3191988, 119.9846392], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 202, name: "CASAnnex 202", coords: [15.3191249, 119.9845857], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 203, name: "CASAnnex 203", coords: [15.3190509, 119.9845321], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 204, name: "CASAnnex 204", coords: [15.3189770, 119.9844786], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 205, name: "CASAnnex 205", coords: [15.3189030, 119.9844250], floor: "2nd Floor", iconOffset: [0, 0] }
                ]
            },
            {
                id: 25,
                name: "College of Arts and Sciences Building",
                shortName: "CAS",
                labelOffset: [0, 0, 35],
                type: "department",
                coords: [15.318245, 119.984534],
                description: "Academic building offering programs in Humanities, Social Sciences, Natural Sciences, and related fields.",
                photo: "images/building images/cas.webp",
                image: "images/building images/cas.webp",
                rooms: [
                    {id: 101, name: "Faculty Room", coords: [15.3181890, 119.9846535], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102, name: "Laboratory Repository System", coords: [15.3182644, 119.9845454], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 103, name: "CAS 103-Biology/Chemistry Laboratory Room", coords: [15.3183398, 119.9844373], floor: "Ground Floor", iconOffset: [0, 0] },

                    {id: 201, name: "CAS 201", coords: [15.3181582, 119.9846304], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 202, name: "CAS 202", coords: [15.3182085, 119.9845583], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 203, name: "CAS 203", coords: [15.3182587, 119.9844863], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 204, name: "CAS 204", coords: [15.3183090, 119.9844142], floor: "2nd Floor", iconOffset: [0, 0] }
                ]
            },
            {
                id: 26,
                name: "Automotive Technology Building",
                shortName: "AUTOMOTIVE TECH",
                labelOffset: [0, 0, 9],
                type: "department",
                coords: [15.318243, 119.984091],
                description: "Building dedicated to automotive technology programs, featuring workshops and laboratories for hands-on training.",
                photo: "images/building images/auto.webp",
                image: "images/building images/auto.webp",
                rooms: []
            },
            {
                id: 27,
                name: "Food Technology Building",
                type: "department",
                shortName: "FOOD TECH",
                labelOffset: [0, 0, 9],
                coords: [15.31805, 119.983957],
                description: "Building housing programs in Food Technology and Food Service Management, including laboratories and training facilities.",
                photo: "images/building images/food.webp",
                image: "images/building images/food.webp",
                rooms: [
                    {id: 101,name: "FSMT Room 11", coords: [15.3180434, 119.9837611], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102, name: "FSMT Room 12", coords: [15.3181336, 119.9837744], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 103, name: "FSMT Room 13", coords: [15.3181197, 119.9838675], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 104, name: "FSMT Room 14", coords: [15.3181058, 119.9839605], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 105, name: "FSMT Room 15", coords: [15.3180919, 119.9840536], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 106, name: "FSMT Room 26", coords: [15.3180780, 119.9841466], floor: "Ground Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 28,
                name: "Mechanical Technology Building",
                type: "department",
                shortName: "MECHANICAL TECH",
                labelOffset: [0, 0, 8],
                coords: [15.317857, 119.983804],
                description: "Building dedicated to mechanical technology programs, featuring workshops and laboratories for hands-on training.",
                photo: "images/building images/mech.webp",
                image: "images/building images/mech.webp",
                rooms: []
            },
            {
                id: 29,
                name: "College of Industrial Technology Building",
                type: "department",
                shortName: "CIT NEW BUILDING",
                labelOffset: [0, 0, 8],
                coords: [15.317459, 119.983481],
                description: "A facility that houses classrooms, laboratories, workshops, and faculty offices for industrial technology programs and hands-on technical training.",
                photo: "images/building images/citnew.webp",
                image: "images/building images/citnew.webp",
                rooms: []
            },
            {
                id: 30,
                name: "Civil Technology Building",
                type: "department",
                shortName: "CIVIL TECH",
                labelOffset: [0, 0, 7],
                coords: [15.317275, 119.983331],
                description: "Building dedicated to civil technology programs, featuring workshops and laboratories for hands-on training.",
                photo: "images/building images/civil.webp",
                image: "images/building images/civil.webp",
                rooms: []
            },
            {
                id: 31,
                name: "Science-Based Education Building",
                type: "department",
                shortName: "SBEB",
                labelOffset: [0, 0, 35],
                coords: [15.318636, 119.984739],
                description: "Building for science-based education programs, housing classrooms, laboratories, and faculty offices.",
                photo: "images/building images/sbeb.webp",
                image: "images/building images/sbeb.webp",
                rooms: [
                    {id: 101,name: "Accreditation Room", coords: [15.3186695, 119.9845558], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102,name: "Extension Room", coords: [15.3186931, 119.9846413], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 103,name: "SBEB-AVR Room", coords: [15.3185713, 119.9848013], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 104,name: "Dean’s Office", coords: [15.3184930, 119.9848100], floor: "Ground Floor", iconOffset: [0, 0] },

                    {id: 201,name: "SBEB Room 201", coords: [15.3184800, 119.9848266], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 202,name: "Educ.Tech Room", coords: [15.3185885, 119.9848154], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 203,name: "Speech Lab", coords: [15.3187103, 119.9846554], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 204,name: "SBEB Room 202", coords: [15.3186803, 119.9845422], floor: "2nd Floor", iconOffset: [0, 0] },

                    {id: 301,name: "SBEB Room 302", coords: [15.3186911, 119.9845286], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 302,name: "SBEB Lab 1 (Physics Lab)", coords: [15.3187275, 119.9846695], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 303,name: "SBEB Lab 2 (Chem Lab)", coords: [15.3186057, 119.9848295], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 304,name: "SBEB Room 301", coords: [15.3184670, 119.9848431], floor: "3rd Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 32,
                name: "Drafting Building 2",
                type: "department",
                shortName: "DRAFTING TECH 2",
                labelOffset: [0, 0, 39],
                coords: [15.318976, 119.983456],
                description: "Building dedicated to drafting technology programs, featuring workshops and laboratories for hands-on training.",
                photo: "images/building images/draft2.webp",
                image: "images/building images/draft2.webp",
                rooms: []
            },
            {
                id: 33,
                name: "Graduate School Building (OLD)",
                type: "department",
                shortName: "GRADUATE SCHOOL (OLD)",
                labelOffset: [0, 0, -52],
                coords: [15.318901, 119.983709],
                description: "Building housing graduate programs, classrooms, seminar rooms, and faculty offices for advanced studies.",
                photo: "images/building images/graduateOld.webp",
                image: "images/building images/graduateOld.webp",
                rooms: [
                    {id: 101, name: "GS Dean’s Office", coords: [15.31898, 119.98381], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 102, name: "GE Staff Office", coords: [15.31882, 119.98368], floor: "Ground Floor", iconOffset: [0, 0] },

                    {id: 103, name: "BS Criminology Faculty Office", coords: [15.31914, 119.98368], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 104, name: "Lombroso Room", coords: [15.31918, 119.98362], floor: "Ground Floor", iconOffset: [0, 0] },
                    {id: 105, name: "Beccaria Room", coords: [15.31922, 119.98356], floor: "Ground Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 34,
                name: "Nursing Skills Laboratory Building",
                type: "department",
                shortName: "NSLB",
                labelOffset: [0, 0, 40],
                coords: [15.316911, 119.982843],  
                description: "Specialized facility for nursing students to practice clinical skills in a simulated environment.",
                photo: "images/building images/nursingskills.webp",
                image: "images/building images/nursingskills.webp",
                rooms: []
            },
            {
                id: 35,
                name: "ROTC Building",
                type: "office",
                shortName: "ROTC",
                labelOffset: [0, 0, 10],
                coords: [15.319122, 119.982638],
                description: "Office for the Reserve Officers' Training Corps (ROTC) program, providing training and leadership development for students.",
                photo: "images/building images/rotc.webp",
                image: "images/building images/rotc.webp",
                rooms: []
            },
            {
                id: 36,
                name: "Student Services and Quality Assurance Building",
                type: "office",
                shortName: "SSQAB",
                labelOffset: [0, 0, -55],
                coords: [15.319123, 119.983897],
                description: "Building dedicated to student services and quality assurance programs, providing support and resources for students.",
                photo: "images/building images/quality.webp",
                image: "images/building images/quality.webp",
                rooms: [
                    {id: 201, name: "Accreditation Room", coords: [15.3193470, 119.9840039], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 202, name: "Conference Room", coords: [15.3192961, 119.9839652], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 203, name: "Office of the Director", coords: [15.3192452, 119.9839265], floor: "2nd Floor", iconOffset: [0, 0] },
                    {id: 204, name: "Office of the Instruction Services", coords: [15.3191943, 119.9838878], floor: "2nd Floor", iconOffset: [0, 0] },

                    {id: 205, name: "Comfort Room", coords: [15.3191434, 119.9838492], floor: "2nd Floor", iconOffset: [0, 0] },

                    {id: 301, name: "Guidance Counseling Services Office (GSCO) - 308", coords: [15.3193791, 119.9839584], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 302, name: "Scholarship Services Office (SSO) - 305", coords: [15.3193537, 119.9839390], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 303, name: "Student Affairs and Services, Director’s Office - 304", coords: [15.3193283, 119.9839197], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 304, name: "Culture and the Arts Developing Office (CADO) - 301", coords: [15.3193028, 119.9839003], floor: "3rd Floor", iconOffset: [0, 0] },

                    {id: 305, name: "Student Organization (SO) - 307", coords: [15.3192774, 119.9838810], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 306, name: "Student Conduct and Discipline Office (SCDO) - 306", coords: [15.3192519, 119.9838617], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 307, name: "GSCO Testing Services Office - Carrier and Job Placement Office (CJPO) - 303", coords: [15.3192265, 119.9838423], floor: "3rd Floor", iconOffset: [0, 0] },
                    {id: 308, name: "Economic Enterprises Development Office - Student Publication Office - 302", coords: [15.3192010, 119.9838230], floor: "3rd Floor", iconOffset: [0, 0] },

                    {id: 309, name: "Comfort Room", coords: [15.3191756, 119.9838036], floor: "3rd Floor", iconOffset: [0, 0] },
                ]
            },
            {
                id: 37,
                name: "Mock Hotel [Tourism and Hospitality Management Building]",
                type: "department",
                shortName: "MOCK HOTEL",
                labelOffset: [0, 0, -22],
                coords: [15.319724, 119.983895],
                description: "Building housing programs in Tourism and Hospitality Management, including training laboratories and classrooms.",
                photo: "images/building images/mock.webp",
                image: "images/building images/mock.webp",
                rooms: []
            },
            {
                id: 38,
                name: "Security Building (Front)",
                type: "facilities",
                shortName: "Guard House (Front)",
                labelOffset: [0, 0, 35],
                coords: [15.319834, 119.984878],
                description: "A facility that serves as the headquarters for campus security personnel, supporting safety operations, monitoring, and emergency response services.",
                photo: "images/building images/guardhouseF.webp",
                image: "images/building images/guardhouseF.webp",
                rooms: []
            },
            {
                id: 39,
                name: "Drafting Building 1",
                type: "department",
                shortName: "DRAFTING TECH 1",
                labelOffset: [0, 0, 35],
                coords: [15.318749, 119.983364],
                description: "A facility that houses drafting classrooms and laboratories used for technical drawing, design, and related instructional activities.",
                photo: "images/building images/draft1.webp",
                image: "images/building images/draft1.webp",
                rooms: [] 
            },
            {
                id: 40,
                name: "Science and Engineering Laboratory Building Annex",
                type: "department",
                shortName: "SELBA",
                labelOffset: [0, 0, -86],
                coords: [15.318952, 119.981891],
                description: "A facility that houses additional science and engineering laboratories, classrooms, and research spaces for experiments, practical activities, and technical instruction.",
                photo: "images/building images/selba.webp",
                image: "images/building images/selba.webp",
                rooms: [] 
            },
            {
                id: 41,
                name: "Motorpool",
                type: "office",
                shortName: "MOTORPOOL",
                labelOffset: [0, 0, -48],
                coords: [15.317486, 119.984163],
                description: "A facility used for the storage, maintenance, and management of university vehicles and transportation equipment.",
                photo: "images/building images/motor.webp",
                image: "images/building images/motor.webp",
                rooms: [] 
            },
            {
                id: 42,
                name: "Executive House",
                type: "facilities",
                shortName: "EXECUTIVE HOUSE",
                labelOffset: [0, 0, -52],
                coords: [15.317921, 119.984589],
                description: "A facility that serves as an office and meeting space for university executives and administrative functions.",
                photo: "images/building images/house.webp",
                image: "images/building images/house.webp",
                rooms: [] 
            },
            {
                id: 43,
                name: "Alumni Association Building",
                type: "office",
                shortName: "ALUMNI OFFICE",
                labelOffset: [0, 0, -52],
                coords: [15.31886, 119.983556],
                description: "An office facility that serves as the center for alumni relations, meetings, and programs that strengthen connections between the university and its graduates.",
                photo: "images/building images/allumni.webp",
                image: "images/building images/allumni.webp",
                rooms: [] 
            },
            {
                id: 44,
                name: "Cultural Arts Building / Stage",
                type: "office",
                shortName: "CULTURAL ARTS",
                labelOffset: [0, 0, 36],
                coords: [15.318458, 119.984593],
                description: "A facility used for cultural performances, artistic programs, rehearsals, and university events that showcase creativity and student talent.",
                photo: "images/building images/stage.webp",
                image: "images/building images/stage.webp",
                rooms: [] 
            },
            {
                id: 45,
                name: "Graduate School Building (New)",
                type: "department",
                shortName: "GRADUATE SCHOOL (NEW)",
                labelOffset: [0, 0, 37],
                coords: [15.319179, 119.983601],
                description: "A facility that houses classrooms, faculty offices, and learning spaces for graduate programs, advanced instruction, and academic research.",
                photo: "images/building images/graduateNew.webp",
                image: "images/building images/graduateNew.webp",
                rooms: [] 
            },
            {
                id: 46,
                name: "Junior High School Building",
                type: "department",
                shortName: "JUNIOR HIGH",
                labelOffset: [0, 0, 38],
                coords: [15.31897, 119.985467],
                description: "A facility that houses classrooms, faculty offices, and learning spaces for junior high school students and academic activities.",
                photo: "images/building images/highschool.webp",
                image: "images/building images/highschool.webp",
                rooms: [
                    { id: 101, name: "Principal's Office", coords: [15.3192999, 119.9850238], floor: "Ground Floor", iconOffset: [0, 0], instructor: "Prof. Helen A. Magno" },
                    { id: 102, name: "Audio Visual Room", coords: [15.3192239, 119.9851271], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 103, name: "Grade 7 Room", coords: [15.3191480, 119.9852304], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 104, name: "Grade 9 Room", coords: [15.3190720, 119.9853337], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 105, name: "Faculty Room", coords: [15.3189960, 119.9854370], floor: "Ground Floor", iconOffset: [0, 0] },

                    { id: 106, name: "Electrical Room", coords: [15.3190546, 119.9855863], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 107, name: "Drafting Room", coords: [15.3190004, 119.9855450], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 108, name: "GEN.ED. Room", coords: [15.3189462, 119.9855037], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 109, name: "Grade 10 Room", coords: [15.3188920, 119.9854624], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 110, name: "Comfort Room", coords: [15.3188378, 119.9854211], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 111, name: "SBO Office", coords: [15.3187836, 119.9853798], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 112, name: "Grade 8 Room", coords: [15.3187294, 119.9853386], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 113, name: "Publication Office", coords: [15.3186752, 119.9852973], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 114, name: "ED.TECH. Room", coords: [15.3186210, 119.9852560], floor: "Ground Floor", iconOffset: [0, 0] },
                    { id: 115, name: "Food Tech. Room", coords: [15.3185668, 119.9852147], floor: "Ground Floor", iconOffset: [0, 0] },
                ] 
            },
            {
                id: 47,
                name: "Hostel",
                type: "facilities",
                shortName: "HOSTEL",
                labelOffset: [0, 0, -53],
                coords: [15.320024, 119.984354],
                description: "A facility that provides temporary accommodation for students, guests, and visitors during academic, university, or official activities.",
                photo: "images/building images/hostel.webp",
                image: "images/building images/hostel.webp",
                rooms: [] 
            },
            {
                id: 48,
                name: "Supply Office Stock Room [RET]",
                type: "facilities",
                shortName: "RET",
                labelOffset: [0, 0, 35],
                coords: [15.320014, 119.984592],
                description: "A facility used for the storage, inventory, and distribution of university supplies, materials, and equipment.",
                photo: "images/building images/ret.webp",
                image: "images/building images/ret.webp",
                rooms: [] 
            },
            {
                id: 49,
                name: "College of Nursing Academic Building",
                type: "department",
                shortName: "CON NEW BUILDING",
                labelOffset: [0, 0, 43],
                coords: [15.316664, 119.983095],
                description: "A facility that houses classrooms, nursing laboratories, faculty offices, and learning spaces for nursing education, clinical skills training, and academic activities.",
                photo: "images/building images/nursingNew.webp",
                image: "images/building images/nursingNew.webp",
                rooms: [] 
            },
            {
                id: 50,
                name: "College of Criminal Justice Building",
                type: "department",
                shortName: "CCJ",
                labelOffset: [0, 0, -83],
                coords: [15.318818, 119.982202],   
                description: "A facility that houses classrooms, laboratories, faculty offices, and learning spaces for criminal justice education and related academic activities.",
                photo: "images/building images/ccj.webp",
                image: "images/building images/ccj.webp",
                rooms: [] 
            },
            {
                id: 51,
                name: "College of Engineering Academic Building",
                type: "department",
                shortName: "COE NEW BUILDING",
                labelOffset: [0, 0, 74],
                coords: [15.317968, 119.981879],
                description: "A facility that houses classrooms, laboratories, faculty offices, and learning spaces for engineering education, research, and practical training.",
                photo: "images/building images/coeNew.webp",
                image: "images/building images/coeNew.webp",
                rooms: [] 
            },
            {
                id: 52,
                name: "Security Building (Exit)",
                type: "facilities",
                shortName: "Guard House (Exit)",
                labelOffset: [0, 0, -45],
                coords: [15.316592, 119.98336],
                description: "",
                photo: "images/building images/guardhouseE.webp",
                image: "images/building images/guardhouseE.webp",
                rooms: []
            }
        
        ],

        
        alerts: [
           // { type: "info",      message: "There is a new gymnasium currently under construction." },
           // { type: "info",      message: "There is a new building being constructed near the exit gate." },
           // { type: "warning",   message: "Road construction near the Main Gate — expect delays." },
           // { type: "emergency", message: "Emergency drill scheduled today at 2:00 PM. Please cooperate." }
        ],
    },
}

// Allow server.js/seed scripts to require() this same data — single
// source of truth for both the browser map and the DB seed script.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = campusData;
}