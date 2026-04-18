'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

const translations = {
  en: {
    navFile: 'File', navVerify: 'Verify', navDashboard: 'Dashboard',
    heroVoice: 'Voice.', heroImmutable: 'Immutable.',
    heroDesc: 'A tamper-proof civic grievance system built to prevent the suppression of citizen complaints. Powered by Ethereum & AI.',
    btnFile: 'FILE COMPLAINT', btnDashboard: 'VIEW DASHBOARD',
    worksTitle: 'How It Works',
    verifyTitle: "Don't Trust. Verify.",
    verifyDesc: "Compare any complaint ID against the Sepolia Testnet live. If a single character in the database is changed, the verification will fail publicly.",
    btnVerify: "ENTER VERIFICATION ENGINE",
    languages: "Languages",
    fileSpeak: "Speak", fileFreely: "Freely.", fileDesc: "VeriVoice anchors your civic complaints to the Ethereum blockchain. It is mathematically impossible for officials to alter, suppress, or delete your grievance.", fileImmutableRec: "IMMUTABLE RECORD", fileImmutableDesc: "Your complaint is cryptographically hashed in your browser. Even if database servers are breached, the public ledger proves the unaltered truth.", fileZeroLogin: "Zero login required", fileNewCase: "New Case File", fileGrievance: "The Grievance", fileCharsLeft: "CHARS LEFT", filePlaceholder: "Describe the issue in detail (minimum 20 characters). Include specific street names, landmarks, and context...", fileListening: "Listening...", fileDictate: "Dictate", fileLocAttached: "Location Attached", fileAttachLoc: "Attach Location", fileAnonShield: "ANONYMITY SHIELD", fileAnonDesc: "Your identity is never stored. The system retains no personal data unless placed explicitly in the text.", fileCategoryAuto: "Category (Auto)", fileClaudeAI: "Claude AI will analyze and route automatically.", fileSubmit: "File Complaint", dashPulse: "Pulse.", dashPulseDesc: "Live Civic Transparency Index", dashLiveFeed: "Live Feed Active", dashTotal: "TOTAL LOGGED", dashResolved: "RESOLVED", dashPending: "PENDING ACTION", dashActiveDepts: "ACTIVE DEPARTMENTS", dashFilters: "FILTERS & SORT", dashListening: "Listening into Blockchain...", dashCatAll: "CATEGORY: ALL", dashSevHigh: "SEVERITY: HIGH (4-5)", dashStatusPending: "STATUS: PENDING"
  },
  hi: {
    navFile: 'शिकायत दर्ज करें', navVerify: 'सत्यापित', navDashboard: 'डैशबोर्ड',
    heroVoice: 'आवाज़.', heroImmutable: 'अपरिवर्तनीय.',
    heroDesc: 'नागरिक शिकायतों के दमन को रोकने के लिए बनाया गया एक छेड़छाड़-प्रूफ नागरिक प्रणाली। एथेरियम और एआई द्वारा संचालित।',
    btnFile: 'शिकायत दर्ज करें', btnDashboard: 'डैशबोर्ड देखें',
    worksTitle: 'यह कैसे काम करता है',
    verifyTitle: "विश्वास मत करो. सत्यापित करो.",
    verifyDesc: "सिपोलिया टेस्टनेट के खिलाफ किसी भी शिकायत आईडी की तुलना करें। यदि डेटाबेस में एक भी अक्षर बदला जाता है, तो सार्वजनिक रूप से सत्यापन विफल हो जाएगा।",
    btnVerify: "सत्यापन इंजन में प्रवेश करें",
    languages: "भाषाएँ",
    fileSpeak: "बोलें", fileFreely: "स्वतंत्र रूप से।", fileDesc: "वेरीवॉयस आपकी नागरिक शिकायतों को एथेरियम ब्लॉकचेन से जोड़ता है। अधिकारियों के लिए आपकी शिकायत को बदलना, दबाना या हटाना गणितीय रूप से असंभव है।", fileImmutableRec: "अपरिवर्तनीय रिकॉर्ड", fileImmutableDesc: "आपकी शिकायत को आपके ब्राउज़र में क्रिप्टोग्राफ़िक रूप से हैश किया गया है। यहां तक कि अगर डेटाबेस सर्वर टूट जाते हैं, तो भी सार्वजनिक खाता बही अपरिवर्तित सत्य साबित होता है।", fileZeroLogin: "शून्य लॉगिन आवश्यक", fileNewCase: "नई केस फ़ाइल", fileGrievance: "शिकायत", fileCharsLeft: "अक्षर शेष", filePlaceholder: "समस्या का विस्तार से वर्णन करें (न्यूनतम 20 अक्षर)। विशिष्ट सड़क के नाम, स्थलों और संदर्भ को शामिल करें...", fileListening: "सुन रहा हूँ...", fileDictate: "बोलकर लिखाएं", fileLocAttached: "स्थान संलग्न", fileAttachLoc: "स्थान संलग्न करें", fileAnonShield: "अनामिकता ढाल", fileAnonDesc: "आपकी पहचान कभी संग्रहीत नहीं की जाती है। सिस्टम किसी भी व्यक्तिगत डेटा को तब तक नहीं रखता है जब तक कि स्पष्ट रूप से पाठ में न रखा जाए।", fileCategoryAuto: "श्रेणी (ऑटो)", fileClaudeAI: "क्लॉड एआई स्वचालित रूप से विश्लेषण और मार्ग प्रशस्त करेगा।", fileSubmit: "शिकायत दर्ज करें", dashPulse: "पल्स।", dashPulseDesc: "लाइव नागरिक पारदर्शिता सूचकांक", dashLiveFeed: "लाइव फ़ीड सक्रिय", dashTotal: "कुल लॉग", dashResolved: "समाधान किया गया", dashPending: "कार्रवाई लंबित", dashActiveDepts: "सक्रिय विभाग", dashFilters: "फ़िल्टर और छँटाई", dashListening: "ब्लॉकचेन में सुन रहा हूँ...", dashCatAll: "श्रेणी: सभी", dashSevHigh: "गंभीरता: उच्च (4-5)", dashStatusPending: "स्थिति: लंबित"
  },
  mr: {
    navFile: 'तक्रार', navVerify: 'पडताळणी', navDashboard: 'डॅशबोर्ड',
    heroVoice: 'आवाज.', heroImmutable: 'अपरिवर्तनीय.',
    heroDesc: 'नागरिक तक्रारी दडपण्यापासून रोखण्यासाठी बनवलेली एक सुरक्षित प्रणाली. इथरियम आणि एआय द्वारा समर्थित.',
    btnFile: 'तक्रार नोंदवा', btnDashboard: 'डॅशबोर्ड पहा',
    worksTitle: 'हे कसे कार्य करते',
    verifyTitle: "विश्वास ठेवू नका. सत्यापित करा.",
    verifyDesc: "सिपोलिया टेस्टनेटवर कोणत्याही तक्रार आयडीची तुलना करा. डेटाबेसमध्ये एकही अक्षर बदलल्यास, पडताळणी सार्वजनिकपणे अयशस्वी होईल.",
    btnVerify: "सत्यापन इंजिनमध्ये जा",
    languages: "भाषा",
    fileSpeak: "बोला", fileFreely: "मुक्तपणे.", fileDesc: "व्हेरीव्हॉइस तुमच्या नागरी तक्रारींना इथरियम ब्लॉकचेनशी जोडते. अधिकाऱ्यांना तुमची तक्रार बदलणे, दाबणे किंवा हटवणे गणितीयदृष्ट्या अशक्य आहे.", fileImmutableRec: "अपरिवर्तनीय नोंद", fileImmutableDesc: "तुमची तक्रार तुमच्या ब्राउझरमध्ये क्रिप्टोग्राफिकरित्या हॅश केली गेली आहे. विदागाराचे सर्व्हर भंग पावले तरीही, सार्वजनिक खातेवही बदललेले सत्य सिद्ध करते.", fileZeroLogin: "लॉगिनची आवश्यकता नाही", fileNewCase: "नवीन केस फाइल", fileGrievance: "तक्रार", fileCharsLeft: "अक्षरे शिल्लक", filePlaceholder: "समस्येचे सविस्तर वर्णन करा (किमान 20 अक्षरे). विशिष्ट रस्त्यांची नावे, खुणा आणि संदर्भ समाविष्ट करा...", fileListening: "ऐकत आहे...", fileDictate: "डिक्टेट करा", fileLocAttached: "स्थान जोडले", fileAttachLoc: "स्थान जोडा", fileAnonShield: "अनामिकता ढाल", fileAnonDesc: "तुमची ओळख कधीही साठवली जात नाही. मजकूरात स्पष्टपणे ठेवल्याशिवाय सिस्टम कोणताही वैयक्तिक डेटा ठेवत नाही.", fileCategoryAuto: "श्रेणी (ऑटो)", fileClaudeAI: "क्लॉड एआई स्वयंचलितपणे विश्लेषण आणि मार्गक्रमण करेल.", fileSubmit: "तक्रार दाखल करा", dashPulse: "पल्स.", dashPulseDesc: "थेट नागरी पारदर्शकता निर्देशांक", dashLiveFeed: "थेट फीड सक्रिय", dashTotal: "एकूण नोंदवलेले", dashResolved: "निराकरण झाले", dashPending: "कारवाई प्रलंबित", dashActiveDepts: "सक्रिय विभाग", dashFilters: "फिल्टर आणि क्रमवारी", dashListening: "ब्लॉकचेनमध्ये ऐकत आहे...", dashCatAll: "श्रेणी: सर्व", dashSevHigh: "तीव्रता: उच्च (4-5)", dashStatusPending: "स्थिती: प्रलंबित"
  },
  bn: {
    navFile: 'ফাইল', navVerify: 'যাচাই করুন', navDashboard: 'ড্যাশবোর্ড',
    heroVoice: 'কণ্ঠস্বর.', heroImmutable: 'অপরিবর্তনীয়.',
    heroDesc: 'নাগরিক অভিযোগ দমন প্রতিরোধে নির্মিত একটি ট্যাম্পার-প্রুফ সিস্টেম। ইথেরিয়াম এবং এআই দ্বারা চালিত।',
    btnFile: 'অভিযোগ দায়ের করুন', btnDashboard: 'ড্যাশবোর্ড দেখুন',
    worksTitle: 'এটি কীভাবে কাজ করে',
    verifyTitle: "বিশ্বাস করবেন না। যাচাই করুন।",
    verifyDesc: "সেপোলিয়া টেস্টনেটের বিরুদ্ধে যেকোনো অভিযোগ আইডি তুলনা করুন। ডাটাবেসের একটি অক্ষরও পরিবর্তন করলে যাচাইকরণ ব্যর্থ হবে।",
    btnVerify: "যাচাইকরণ ইঞ্জিনে প্রবেশ করুন",
    languages: "ভাষা",
    fileSpeak: "বলুন", fileFreely: "স্বাধীনভাবে।", fileDesc: "ভেরিভয়েস আপনার নাগরিক অভিযোগগুলিকে ইথেরিয়াম ব্লকচেইনের সাথে যুক্ত করে। কর্মকর্তাদের পক্ষে আপনার অভিযোগ পরিবর্তন, দমন বা মুছে ফেলা গাণিতিকভাবে অসম্ভব।", fileImmutableRec: "অপরিবর্তনীয় রেকর্ড", fileImmutableDesc: "আপনার অভিযোগ আপনার ব্রাউজারে ক্রিপ্টোগ্রাফিকভাবে হ্যাশ করা হয়েছে। ডাটাবেস সার্ভারগুলি লঙ্ঘিত হলেও, সর্বজনীন খতিয়ান অপরিবর্তিত সত্য প্রমাণ করে।", fileZeroLogin: "শূন্য লগইন প্রয়োজন", fileNewCase: "নতুন কেস ফাইল", fileGrievance: "অভিযোগ", fileCharsLeft: "অক্ষর বাকি", filePlaceholder: "সমস্যাটি বিস্তারিতভাবে বর্ণনা করুন (ন্যূনতম 20টি অক্ষর)। নির্দিষ্ট রাস্তার নাম, ল্যান্ডমার্ক এবং প্রসঙ্গ অন্তর্ভুক্ত করুন...", fileListening: "শুনছি...", fileDictate: "ডিক্টেট করুন", fileLocAttached: "অবস্থান সংযুক্ত", fileAttachLoc: "অবস্থান সংযুক্ত করুন", fileAnonShield: "নাম প্রকাশ না করার ঢাল", fileAnonDesc: "আপনার পরিচয় কখনও সংরক্ষণ করা হয় না। সিস্টেমে স্পষ্টভাবে পাঠ্যে না রাখলে কোনো ব্যক্তিগত ডেটা ধরে রাখে না।", fileCategoryAuto: "বিভাগ (অটো)", fileClaudeAI: "ক্লড এআই স্বয়ংক্রিয়ভাবে বিশ্লেষণ এবং রুট করবে।", fileSubmit: "অভিযোগ দায়ের করুন", dashPulse: "পালস।", dashPulseDesc: "লাইভ নাগরিক স্বচ্ছতা সূচক", dashLiveFeed: "লাইভ ফিড সক্রিয়", dashTotal: "মোট লগ করা", dashResolved: "সমাধান হয়েছে", dashPending: "পদক্ষেপ মুলতুবি", dashActiveDepts: "সক্রিয় বিভাগগুলি", dashFilters: "ফিল্টার এবং সাজান", dashListening: "ব্লকচেইনে শুনছি...", dashCatAll: "বিভাগ: সব", dashSevHigh: "তীব্রতা: উচ্চ (4-5)", dashStatusPending: "অবস্থা: মুলতুবি"
  },
  ta: {
    navFile: 'கோப்பு', navVerify: 'சரிபார்க்கவும்', navDashboard: 'டாஷ்போர்டு',
    heroVoice: 'குரல்.', heroImmutable: 'மாற்ற முடியாதது.',
    heroDesc: 'குடிமக்கள் புகார்கள் ஒடுக்கப்படுவதை தடுக்க உருவாக்கப்பட்ட ஒரு பாதுகாப்பான அமைப்பு. எத்தேரியம் மற்றும் AI ஆல் இயக்கப்படுகிறது.',
    btnFile: 'புகார் பதிவு செய்', btnDashboard: 'டாஷ்போர்டைக் காண்க',
    worksTitle: 'இது எப்படி வேலை செய்கிறது',
    verifyTitle: "நம்ப வேண்டாம். சரிபார்க்கவும்.",
    verifyDesc: "எந்தவொரு புகார் ஐடியையும் செபோலியா டெஸ்ட்நெட் உடன் ஒத்திசைக்கவும். தரவுத்தளத்தில் ஒரு எழுத்து மாற்றப்பட்டால் சரிபார்ப்பு தோல்வியடையும்.",
    btnVerify: "சரிபார்ப்பு இயந்திரத்தில் நுழைக",
    languages: "மொழிகள்",
    fileSpeak: "பேசுக", fileFreely: "சுதந்திரமாக.", fileDesc: "வெரிவாய்ஸ் உங்கள் குடிமை புகார்களை எத்தேரியம் பிளாக்செயினுடன் இணைக்கிறது. உங்கள் குறையை மாற்றுவது, அடக்குவது அல்லது நீக்குவது அதிகாரிகளுக்கு கணிதவியல்படி சாத்தியமற்றது.", fileImmutableRec: "மாற்ற முடியாத பதிவு", fileImmutableDesc: "உங்கள் புகார் உங்கள் உலாவியில் கிரிப்டோகிராஃபிக் முறையில் ஹாஷ் செய்யப்பட்டுள்ளது. தரவுத்தள சேவையகங்கள் மீறப்பட்டாலும், பொதுப் பேரேடு மாறாத உண்மையை நிரூபிக்கிறது.", fileZeroLogin: "உள்நுழைவு தேவையில்லை", fileNewCase: "புதிய வழக்கு கோப்பு", fileGrievance: "குறை", fileCharsLeft: "எழுத்துக்கள் மீதம்", filePlaceholder: "சிக்கலை விரிவாக விவரிக்கவும் (குறைந்தபட்சம் 20 எழுத்துக்கள்). குறிப்பிட்ட தெரு பெயர்கள், அடையாளங்கள் மற்றும் சூழலைச் சேர்க்கவும்...", fileListening: "கேட்கிறது...", fileDictate: "டிக்டேட் செய்க", fileLocAttached: "இடம் இணைக்கப்பட்டுள்ளது", fileAttachLoc: "இடத்தை இணைக்கவும்", fileAnonShield: "அநாமதேய கேடயம்", fileAnonDesc: "உங்கள் அடையாளம் எங்கும் சேமிக்கப்படாது. உரையில் வெளிப்படையாக வைக்கப்படாவிட்டால் எந்த தனிப்பட்ட தரவையும் கணினி வைத்திருக்காது.", fileCategoryAuto: "வகை (தானியங்கி)", fileClaudeAI: "கிளாட் ஏஐ தானாகவே பகுப்பாய்வு செய்து வழிநடத்தும்.", fileSubmit: "புகார் அளிக்கவும்", dashPulse: "துடிப்பு.", dashPulseDesc: "நேரடி குடிமை வெளிப்படைத்தன்மை குறியீடு", dashLiveFeed: "நேரடி ஊட்டம் செயலில் உள்ளது", dashTotal: "மொத்தம் பதிவு செய்யப்பட்டவை", dashResolved: "தீர்க்கப்பட்டது", dashPending: "நடவடிக்கை நிலுவையில் உள்ளது", dashActiveDepts: "செயலில் உள்ள துறைகள்", dashFilters: "வடிகட்டிகள் & வரிசைப்படுத்து", dashListening: "பிளாக்செயினில் கேட்கிறது...", dashCatAll: "வகை: அனைத்தும்", dashSevHigh: "தீவிரம்: அதிகம் (4-5)", dashStatusPending: "நிலை: நிலுவையில் உள்ளது"
  },
  te: {
    navFile: 'ఫైల్', navVerify: 'ధృవీకరించండి', navDashboard: 'డాష్‌బోర్డ్',
    heroVoice: 'వాయిస్.', heroImmutable: 'మార్చలేనిది.',
    heroDesc: 'పౌరుల ఫిర్యాదుల అణిచివేతను నిరోధించడానికి రూపొందించబడిన ట్యాంపర్-ప్రూఫ్ సిస్టమ్. ఎథెరియం మరియు AI పవర్డ్.',
    btnFile: 'ఫిర్యాదు చేయండి', btnDashboard: 'డాష్‌బోర్డ్ చూడండి',
    worksTitle: 'ఇది ఎలా పనిచేస్తుంది',
    verifyTitle: "నమ్మవద్దు. ధృవీకరించండి.",
    verifyDesc: "సెపోలియా టెస్ట్‌నెట్‌లో ఏ ఫిర్యాదు ఐడీనైనా పోల్చండి. డేటాబేస్‌లో ఒక్క అక్షరం మారినా, ధృవీకరణ విఫలమవుతుంది.",
    btnVerify: "ధృవీకరణ ఇంజిన్‌లోకి ప్రవేశించండి",
    languages: "భాషలు",
    fileSpeak: "మాట్లాడండి", fileFreely: "స్వేచ్ఛగా.", fileDesc: "వెరివాయిస్ మీ పౌర ఫిర్యాదులను ఎథెరియం బ్లాక్‌చెయిన్‌కు అనుసంధానిస్తుంది. అధికారులు మీ ఫిర్యాదును మార్చడం, అణచివేయడం లేదా ఏ తీసివేయడం గణితశాస్త్రపరంగా అసాధ్యం.", fileImmutableRec: "మార్చలేని రికార్డు", fileImmutableDesc: "మీ ఫిర్యాదు మీ బ్రౌజర్‌లో క్రిప్టోగ్రాఫిక్‌గా హాష్ చేయబడింది. డేటాబేస్ సర్వర్లు ఉల్లంఘించబడినప్పటికీ, పబ్లిక్ లెడ్జర్ మారని సత్యాన్ని రుజువు చేస్తుంది.", fileZeroLogin: "లాగిన్ అవసరం లేదు", fileNewCase: "కొత్త కేసు ఫైల్", fileGrievance: "ఫిర్యాదు", fileCharsLeft: "అక్షరాలు మిగిలి ఉన్నాయి", filePlaceholder: "సమస్యను వివరంగా వివరించండి (కనీసం 20 అక్షరాలు). నిర్దిష్ట వీధి పేర్లు, ల్యాండ్‌మార్క్‌లు మరియు సందర్భాన్ని చేర్చండి...", fileListening: "వింటుంది...", fileDictate: "డిక్టేట్ చేయండి", fileLocAttached: "స్థానం జోడించబడింది", fileAttachLoc: "స్థానాన్ని జోడించండి", fileAnonShield: "అజ్ఞాత షీల్డ్", fileAnonDesc: "మీ గుర్తింపు ఎప్పుడూ నిల్వ చేయబడదు. వచనంలో స్పష్టంగా ఉంచితే తప్ప సిస్టమ్ వ్యక్తిగత డేటాను ఉంచదు.", fileCategoryAuto: "వర్గం (ఆటో)", fileClaudeAI: "క్లాడ్ ఏఐ స్వయంచాలకంగా విశ్లేషించి మరియు దారి మళ్లిస్తుంది.", fileSubmit: "ఫిర్యాదు దాఖలు చేయండి", dashPulse: "పల్స్.", dashPulseDesc: "లైవ్ పౌర పారదర్శకత సూచిక", dashLiveFeed: "లైవ్ ఫీడ్ యాక్టివ్‌గా ఉంది", dashTotal: "మొత్తం లాగ్ చేయబడినవి", dashResolved: "పరిష్కరించబడింది", dashPending: "చర్య పెండింగ్‌లో ఉంది", dashActiveDepts: "క్రియాశీల విభాగాలు", dashFilters: "ఫిల్టర్‌లు & క్రమబద్ధీకరించు", dashListening: "బ్లాక్‌చెయిన్‌లో వింటుంది...", dashCatAll: "వర్గం: అన్నీ", dashSevHigh: "తీవ్రత: ఎక్కువ (4-5)", dashStatusPending: "స్థితి: పెండింగ్‌లో ఉంది"
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  
  useEffect(() => {
    const saved = localStorage.getItem('site_lang') as Language;
    if (saved) setLang(saved);
  }, []);

  const t = (key: keyof typeof translations['en']): string => {
    return translations[lang]?.[key] || translations['en'][key];
  };
  
  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('site_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);