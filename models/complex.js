/**
 * This is the default configuration file for the data generator in COMPLEX mode
 * notice how the config object is structured, and see it's type definition in ./types.d.ts
 * feel free to modify this file to customize the data you generate
 * see helper functions in utils.js for more ways to generate data
 */


const Chance = require('chance');
const chance = new Chance();
const { weightedRange, date, integer } = require('../utils.js');
const u = require('ak-tools');

/** @type {import('../types.js').Config} */
const config = {
	token: "",
	seed: "quite complex",
	numDays: 30, //how many days worth of data
	numEvents: 100000, //how many events
	numUsers: 1000, //how many users	
	format: 'csv', //csv or json
	region: "US",
	anonIds: true, //if true, anonymousIds are created for each user
	sessionIds: true, //if true, sessionIds are created for each user

	events: [
		{
			"event": "checkout",
			"weight": 2,
			"properties": {
				amount: weightedRange(5, 500, 1000, .25),
				currency: ["USD", "USD", "USD", "CAD", "EUR", "EUR", "BTC", "BTC", "ETH", "JPY"],
				cart: makeProducts(12),
			}
		},
		{
			"event": "add to cart",
			"weight": 4,
			"properties": {
				amount: weightedRange(5, 500, 1000, .25),
				qty: integer(1, 5),
				product_id: weightedRange(1, 1000, 42, 1.4)
			}
		},
		{
			"event": "page view",
			"weight": 10,
			"properties": {
				page: ["/", "/", "/", "/learn-more", "/pricing", "/contact", "/about", "/careers", "/sign-up", "/login", "/app", "/app", "/app", "/app"],
				utm_source: ["$organic", "$organic", "$organic", "$organic", "google", "google", "google", "facebook", "facebook", "twitter", "linkedin"],
			}
		},
		{
			"event": "watch video",
			"weight": 8,
			"properties": {
				category: ["funny", "educational", "inspirational", "music", "news", "sports", "cooking", "DIY", "travel", "gaming"],
				hashTags: makeHashTags,
				watchTimeSec: weightedRange(10, 600, 1000, .25),
				quality: ["2160p", "1440p", "1080p", "720p", "480p", "360p", "240p"],
				format: ["mp4", "avi", "mov", "mpg"],
				video_id: weightedRange(1, 50000, 420000, 1.4),

			}
		},
		{
			"event": "view item",
			"weight": 8,
			"properties": {
				product_id: weightedRange(1, 1000, 24, 3),
				colors: ["light", "dark", "custom", "dark"]
			}
		},
		{
			"event": "save item",
			"weight": 5,
			"properties": {
				product_id: weightedRange(1, 1000, 8, 12),
				colors: ["light", "dark", "custom", "dark"]
			}
		},
		{
			"event": "support ticket",
			"weight": 2,
			"properties": {
				product_id: weightedRange(1, 1000, 420, .6),
				description: chance.sentence.bind(chance),
				severity: ["low", "medium", "high"],
				ticket_id: chance.guid.bind(chance)
			}
		},
		{
			"event": "sign up",
			"isFirstEvent": true,
			"weight": 0,
			"properties": {
				plan: ["free", "free", "free", "free", "basic", "basic", "basic", "premium", "premium", "enterprise"],
				dateOfRenewal: date(100, false),
				codewords: u.makeName,
			}
		}
	],
	superProps: {
		device: deviceAttributes()
		// emotions: generateEmoji(),

	},
	/*
	user properties work the same as event properties
	each key should be an array or function reference
	*/
	userProps: {
		title: chance.profession.bind(chance),
		luckyNumber: weightedRange(42, 420),
		experiment: designExperiment(),
		spiritAnimal: ["unicorn", "dragon", "phoenix", "sasquatch", "yeti", "kraken", "jackalope", "thunderbird", "mothman", "nessie", "chupacabra", "jersey devil", "bigfoot", "weindgo", "bunyip", "mokele-mbembe", "tatzelwurm", "megalodon"],
		timezone: chance.timezone.bind(chance), // ["America/New_York", "America/Los_Angeles", "America/Chicago", "America/Denver", "America/Phoenix", "America/Anchorage", "Pacific/Honolulu"]
		ip: chance.ip.bind(chance),
		lastCart: makeProducts(5),

	},

	/** each generates it's own table */
	scdProps: {
		plan: ["free", "free", "free", "free", "basic", "basic", "basic", "premium", "premium", "enterprise"],
		MRR: weightedRange(0, 10000, 1000, .15),
		NPS: weightedRange(0, 10, 150, 2),
		subscribed: [true, true, true, true, true, true, false, false, false, false, "it's complicated"],
		renewalDate: date(100, false),
	},

	mirrorProps: {
		isBot: { events: "*", values: [false, false, false, false, true] },
		profit: { events: ["checkout"], values: [4, 2, 42, 420] },
		watchTimeSec: {
			events: ["watch video"],
			values: weightedRange(50, 1200, 247, 6)
		}
	},

	/*
	for group analytics keys, we need an array of arrays [[],[],[]] 
	each pair represents a group_key and the number of profiles for that key
	*/
	groupKeys: [
		['company_id', 500],
		['room_id', 10000],

	],
	groupProps: {
		company_id: {
			$name: () => { return chance.company(); },
			$email: () => { return `CSM: ${chance.pickone(["AK", "Jessica", "Michelle", "Dana", "Brian", "Dave"])}`; },
			"# of employees": weightedRange(3, 10000),
			"industry": ["tech", "finance", "healthcare", "education", "government", "non-profit"],
			"segment": ["enterprise", "SMB", "mid-market"],
			"products": [["core"], ["core"], ["core", "add-ons"], ["core", "pro-serve"], ["core", "add-ons", "pro-serve"], ["core", "BAA", "enterprise"], ["free"], ["free"], ["free", "addons"]],
		},
		room_id: {
			$name: () => { return `#${chance.word({ length: integer(4, 24), capitalize: true })}`; },
			$email: ["public", "private"],
			"room provider": ["partner", "core", "core", "core"],
			"room capacity": weightedRange(3, 1000000),
			"isPublic": [true, false, false, false, false],
			"country": chance.country.bind(chance),
			"isVerified": [true, true, false, false, false],
		}
	},

	lookupTables: [
		{
			key: "product_id",
			entries: 1000,
			attributes: {
				category: [
					"Books", "Movies", "Music", "Games", "Electronics", "Computers", "Smart Home", "Home", "Garden & Tools", "Pet Supplies", "Food & Grocery", "Beauty", "Health", "Toys", "Kids", "Baby", "Handmade", "Sports", "Outdoors", "Automotive", "Industrial", "Entertainment", "Art"
				],
				"demand": ["high", "medium", "medium", "low"],
				"supply": ["high", "medium", "medium", "low"],
				"manufacturer": chance.company.bind(chance),
				"price": weightedRange(5, 500, 1000, .25),
				"rating": weightedRange(1, 5),
				"reviews": weightedRange(0, 35)
			}

		},
		{
			key: "video_id",
			entries: 50000,
			attributes: {
				isFlagged: [true, false, false, false, false],
				copyright: ["all rights reserved", "creative commons", "creative commons", "public domain", "fair use"],
				uploader_id: chance.guid.bind(chance),
				"uploader influence": ["low", "low", "low", "medium", "medium", "high"],
				thumbs: weightedRange(0, 35),
				rating: ["G", "PG", "PG-13", "R", "NC-17", "PG-13", "R", "NC-17", "R", "PG", "PG"]
			}

		}
	],

	hook: function (record, type, meta) {
		return record;
	}
};



function makeHashTags() {
	const possibleHashtags = [];
	for (let i = 0; i < 20; i++) {
		possibleHashtags.push('#' + u.makeName(2, ''));
	}

	const numHashtags = integer(integer(1, 5), integer(5, 10));
	const hashtags = [];
	for (let i = 0; i < numHashtags; i++) {
		hashtags.push(chance.pickone(possibleHashtags));
	}
	return [hashtags];
};

function makeProducts(maxItems = 10) {

	return function () {
		const categories = ["Device Accessories", "eBooks", "Automotive", "Baby Products", "Beauty", "Books", "Camera & Photo", "Cell Phones & Accessories", "Collectible Coins", "Consumer Electronics", "Entertainment Collectibles", "Fine Art", "Grocery & Gourmet Food", "Health & Personal Care", "Home & Garden", "Independent Design", "Industrial & Scientific", "Accessories", "Major Appliances", "Music", "Musical Instruments", "Office Products", "Outdoors", "Personal Computers", "Pet Supplies", "Software", "Sports", "Sports Collectibles", "Tools & Home Improvement", "Toys & Games", "Video, DVD & Blu-ray", "Video Games", "Watches"];
		const slugs = ['/sale/', '/featured/', '/home/', '/search/', '/wishlist/', '/'];
		const assetExtension = ['.png', '.jpg', '.jpeg', '.heic', '.mp4', '.mov', '.avi'];
		const data = [];
		const numOfItems = integer(1, 12);

		for (var i = 0; i < numOfItems; i++) {
			const category = chance.pickone(categories);
			const slug = chance.pickone(slugs);
			const asset = chance.pickone(assetExtension);
			const product_id = chance.guid();
			const price = integer(1, 300);
			const quantity = integer(1, 5);

			const item = {
				product_id: product_id,
				sku: integer(11111, 99999),
				amount: price,
				quantity: quantity,
				value: price * quantity,
				featured: chance.pickone([true, false]),
				category: category,
				urlSlug: slug + category,
				asset: `${category}-${integer(1, 20)}${asset}`
			};

			data.push(item);
		}

		return [data];
	};
};


function designExperiment() {
	return function () {
		const variants = ["A", "B", "C", "Control"];
		const variant = chance.pickone(variants);
		const experiments = ["no password", "social sign in", "new tutorial", "new search"];
		const experiment = chance.pickone(experiments);
		const multi_variates = ["A/B", "A/B/C", "A/B/C/D", "Control"];
		const multi_variate = chance.pickone(multi_variates);
		const impression_id = chance.guid();



		const chosen = {
			variant,
			experiment,
			multi_variate,
			impression_id
		};

		return [chosen];
	};
}

function deviceAttributes(isMobile = false) {
	return function () {
		let devices = ["desktop", "laptop", "desktop", "laptop", "desktop", "laptop", "other"];
		if (isMobile) devices = [...devices, "mobile", "mobile", "mobile", "tablet"];
		const device = chance.pickone(devices);
		let oses = ["Windows", "macOS", "Windows", "macOS", "macOS", "Linux", "Windows", "macOS", "Windows", "macOS", "macOS", "TempleOS"];
		if (isMobile) oses = [...oses, "iOS", "Android", "iOS", "Android"];
		const os = chance.pickone(oses);
		const browser = chance.pickone(["Chrome", "Firefox", "Safari", "Edge", "Opera", "IE", "Brave", "Vivaldi"]);
		const version = chance.integer({ min: 1, max: 15 });
		const resolution = chance.pickone(["1920x1080", "1280x720", "1024x768", "800x600", "640x480"]);
		const language = chance.pickone(["en-US", "en-US", "en-US", "en-GB", "es", "es", "fr", "de", "it", "ja", "zh", "ru"]);

		const chosen = {
			platform: device,
			os,
			browser,
			version,
			resolution,
			language
		};

		return [chosen];

	};
}






module.exports = config;