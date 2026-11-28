# हिसाब teaser: making the 17 clips in Google Flow

This session runs in the cloud and has no browser, so it can't press buttons in your Chrome. **Claude in Chrome**, the browser extension, can.
1. Open its side panel in the Chrome window where Flow is open.
2. Paste in the whole block below.
3. Each day, ask it for that day's batch.

Then send the clips here: `teaser.py` cuts them into the 16:9 teaser.

The 50 free credits a day cover the 17 clips in **7 days**:
- each clip with people on Veo 3.1 Fast (about 20 credits);
- each clip without people on Veo 3.1 Lite (about 10 credits).

On a paid plan, run all the batches in one sitting.

````text
You are making clips for a 40-second Hindi film teaser in Google Flow (labs.google/flow), which is open in this Chrome window. Work only in Flow and, if needed, the Gemini app (gemini.google.com).
Never buy credits, start a subscription, or change account settings. Before every generation, check the credit cost Flow shows; if today's credits can't cover the next clip, stop and tell me.

SETTINGS (check them before every generation)
- Project: create one called "Hisaab Teaser", or open it if it exists.
- Aspect ratio: 16:9 landscape.
- Outputs per prompt: 1.
- Model: Veo 3.1 Fast for clips with ingredients, Veo 3.1 Lite for clips marked "no ingredients".

STEP 1 (first time only): CHARACTER INGREDIENTS
Make these 7 reference images and add each one to the project as an ingredient with the name given. If Flow can create an ingredient image from a prompt, do it there; otherwise make the image in the Gemini app, download it, and upload it to Flow. Use the same images for every clip.

ISH: Full-body character reference portrait of a tall, athletic Indian man of 23: broad shoulders, very short army-style crew cut, light stubble, sharp jaw, intense dark eyes, a red-and-black sacred thread on his right wrist. He wears a plain blue cricket jersey with no logos, grey track pants and sports shoes, and holds a cricket bat over one shoulder. Standing, facing the camera, plain grey studio background, soft even light, photoreal, early-2000s style.

OMI: Full-body character reference portrait of a stocky, chubby Indian young man of 21: round cheerful face, clean-shaven, short black hair, a red and yellow tilak on his forehead, a rudraksha bead necklace, a white sacred thread visible at the collar. He wears a saffron cotton kurta, white pyjama and leather chappals, with an innocent wide smile. Standing, facing the camera, plain grey studio background, soft even light, photoreal, early-2000s style.

GOVIND: Full-body character reference portrait of a slim Indian young man of 21 from Gujarat: medium height, wheatish skin, neat side-parted black hair, thin metal-frame glasses, clean-shaven, serious calculating eyes. He wears a light-blue checked half-sleeve cotton shirt tucked into grey trousers, a black digital wristwatch and a pen in his shirt pocket, with a canvas rucksack on one shoulder. Standing, facing the camera, plain grey studio background, soft even light, photoreal, early-2000s style.

VIDYA: Full-body character reference portrait of a lively Indian young woman of about 20: slim, big expressive kohl-lined eyes, long wavy black hair in a loose side braid, a small silver nose stud, silver jhumka earrings, a mischievous smile. She wears a bright yellow cotton kurti over blue jeans, with a dupatta loosely over one shoulder. Standing, facing the camera, plain grey studio background, soft even light, photoreal, early-2000s style.

ALI: Full-body character reference portrait of a thin Indian boy of 12: small frame, light brown skin, striking hazel-green eyes, slightly messy black hair, a shy half-smile. He wears a white cotton kurta-pyjama and rubber sandals, with a small cloth pouch of glass marbles tied at his waist. Standing, facing the camera, plain grey studio background, soft even light, photoreal, early-2000s style.

MAMA: Full-body character reference portrait of a heavyset Indian man of 46: thick black moustache, receding oiled hair, a large vermilion tilak on his forehead, a gold chain, a red thread on his wrist, a commanding loud presence. He wears a saffron cotton kurta with white pyjama and holds a handkerchief. Standing, facing the camera, plain grey studio background, soft even light, photoreal, early-2000s style.

DHIRAJ: Full-body character reference portrait of a skinny Indian boy of 14 with a big bright grin, short hair and an oversized white school shirt with grey shorts. Plain grey studio background, soft even light, photoreal, early-2000s style.

STEP 2: TODAY'S CLIPS
Make the clips in today's batch (see BATCHES). For each clip:
1. Attach the ingredients listed.
2. Paste its prompt exactly.
3. Generate.
4. If the result is badly wrong (wrong faces, extra limbs, words written on screen), regenerate once, only if credits allow.
5. Download the clip and note its file name next to the clip's code (T1, T2 ...).
If Flow refuses a prompt, use the SAFER prompt given under that clip, or tell me.

BATCHES (about 50 credits a day)
Day 1: T2, T3, T1
Day 2: T6, T7, T4
Day 3: T8, T9, T5
Day 4: T10, T11, T13
Day 5: T12, T14
Day 6: T15, T16
Day 7: T19, then retakes

THE CLIPS

T1 (no ingredients, Lite)
Extreme close-up of a hospital heart monitor's green line pulsing in a dark room; the beep grows steady and rhythmic. A weak young man's voice-over says softly in Hindi: "मुझे गणित पर भरोसा था…" Cinematic Hindi drama film, shot on 35mm film, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Cool blue-green tones, soft fluorescent light, muted colours.

T2 (ingredients: ISH, OMI, GOVIND)
On a flat rooftop in old Ahmedabad at golden hour, three young friends sit on the parapet sharing cutting chai in small glasses and laughing together; colourful kites fly overhead and a white temple dome stands behind them; the one with glasses scribbles numbers in a notebook. A calm young man's voice-over says in Hindi: "गणित कभी धोखा नहीं देता।" Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Warm golden nostalgic light, saffron, turquoise and lime-wash colours, early-2000s Ahmedabad.

T3 (ingredients: ALI)
Slow motion on a dusty school ground under harsh summer sun: the thin boy in a white kurta-pyjama watches the ball with calm, unblinking hazel-green eyes and swings an oversized bat; the tennis ball rockets into the sky. Off screen, a young man shouts excitedly in Hindi: "ये बच्चा… हिंदुस्तान का अगला बड़ा नाम है!" Sound of the bat's crack and kids shouting. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Warm golden nostalgic light, early-2000s Ahmedabad.

T4 (no ingredients, Lite)
Low angle: a tennis ball soars over a neem tree and a broken boundary wall into a white-hot summer sky, as children's heads turn to follow it. Sound of kids cheering. Cinematic Hindi drama film, shot on 35mm film, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Warm golden nostalgic light, early-2000s India.

T5 (no ingredients, Lite)
Extreme close-up in a small Indian kitchen: steel tumblers on a shelf begin to tremble and chatter, and the tea in a pan on a gas stove ripples in rings, as an earthquake begins. Sound of a deep rumble rising and steel rattling. Cinematic Hindi drama film, shot on 35mm film, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Warm morning light turning to dusty grey, handheld camera.

T6 (ingredients: GOVIND)
The young man with glasses runs into frame and stops dead. In front of him, where a half-built mall stood, is a mountain of broken concrete and twisted steel rods; dust hangs in golden morning light and a torn banner flaps on the rubble; his face is white with dust. Slow push-in from behind him, then on his face. Sound of wind and distant sirens. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Warm golden light through dust, desaturated.

T7 (ingredients: VIDYA, GOVIND)
At night under a big black water tank on a rooftop terrace, in a cosy hideout of pink cushions, the young woman in a shiny red kurti blows out eighteen tiny candles on a small chocolate cake; in the curling smoke she leans in and gently kisses the young man with glasses. Soft focus, candle glow. Sound of candle flames and distant city. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Warm candle-amber light, soft bloom, tender and intimate.

T8 (ingredients: OMI)
Close-up at dusk on a beach promenade: the chubby young man's cheerful smile fades as he looks at his friend off screen; serious for once, he says quietly in Hindi: "गोविंद… प्रोटोकॉल।" Sound of waves. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Magenta dusk light, soft bloom.

T9 (ingredients: DHIRAJ, OMI)
Night at an Indian railway station: a long sleeper train begins to pull out; the 14-year-old boy waves happily from a barred window, wearing a saffron headband; on the platform the chubby young man waves back, smiling. Sound of a long train whistle and wheels. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Sodium-yellow station lights, early-2000s India.

T10 (ingredients: ISH, OMI, GOVIND)
In a tiny cricket shop the three friends stand frozen in front of a small old CRT television; its flickering light plays over their shocked faces; the screen itself is out of focus. A muffled TV newsreader's voice says in Hindi: "जले हुए डिब्बे का नंबर: S6।" Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Cold daylight and TV flicker, early-2000s Ahmedabad.

T11 (ingredients: GOVIND, ISH, OMI)
At night on the flat roof of an old colonial bank building, the three friends crouch behind the parapet and look out in fear: across the old city three fires burn, smoke glowing orange against the black sky. Sound of distant drums, crackling fire, barking dogs. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Night, flickering orange firelight against deep blue darkness, smoke haze, handheld camera, high contrast.

T12 (ingredients: MAMA)
Behind a rusted iron gate at night stands a crowd of men holding burning torches; at the front, the heavyset man with the thick moustache, sweating and red-eyed, holding a torch, stares straight through the bars and says in a low, menacing voice in Hindi: "मुझे वो लड़का चाहिए।" Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Night, flickering orange firelight against deep blue darkness, smoke haze, handheld camera, high contrast.

T13 (no ingredients, Lite)
From above at night: a sheet of flame bursts across an old stone courtyard; dark silhouettes flee through an iron gate. Sound of a whoosh of fire and shouting. Cinematic film, shot on 35mm film, gentle film grain. No on-screen text, no subtitles, no background music. Night, orange firelight against deep blue darkness, smoke haze, high contrast.

T14 (ingredients: ISH, GOVIND)
In a dim old office at night, the athletic young man, furious and hurt, slaps his friend with glasses hard across the face; the friend's head turns with the blow and his glasses slip. Sound of a sharp slap. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Night, flickering orange firelight against deep blue darkness, handheld camera, high contrast.

T15 (ingredients: MAMA, OMI)
In a dark office lit by firelight, the chubby young man lunges forward with his arms out, shouting in Hindi: "मामा, नहीं!" Behind him, the heavyset man's huge shadow falls across the wall. Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Night, flickering orange firelight against deep blue darkness, smoke haze, handheld camera, high contrast.

T16 (ingredients: GOVIND)
Extreme close-up, almost frozen: the young man's eyes behind his glasses, full of fear and calculation, sweat on his temple, firelight flickering across his face. Sound of a clock ticking and a heartbeat, both slowing down. A whispering voice-over in Hindi: "एक सेकंड…" Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Night, orange firelight against deep blue darkness, high contrast.

T19 (ingredients: ALI)
Inside a small dark steel vault room, the thin boy in a white kurta hugs his knees; the light of a mobile phone shows his tear-streaked face; he looks up and whispers in Hindi: "अंधेरा है, भैया…" Cinematic Hindi drama film, shot on 35mm film, realistic Indian faces and natural skin texture, shallow depth of field, gentle film grain. No on-screen text, no subtitles, no background music. Night, cold blue darkness and the phone's glow, high contrast.

SAFER PROMPTS (use only if Flow refuses)
T12: replace "stares straight through the bars and says…" with "stares straight through the bars, silent and menacing".
T14: "In a dim old office at night, the athletic young man shoves his friend with glasses against a wall in anger; the friend does not fight back."
T15: "In a dark office lit by firelight, the chubby young man runs forward with his arms out, shouting in Hindi: "मामा, नहीं!""

When today's batch is done, tell me which downloaded file is which clip code, and how many credits are left.
````

## After the clips are made

- **Name them:** `T1.mp4` … `T19.mp4` (there's no T17 or T18: those are the black frame and the title, made in the edit).
- **Send them here,** a batch at a time if you like.
- **What I do:**
  - put them in `teaser/`;
  - set the trims (`FROM` in `teaser.py`), and lift any voice line that lands outside its slot (`VOICE`);
  - render `teaser.mp4`: 1920 × 1080, 16:9, with the grade, the three flash cards, the title and the sound.
- **Until all 17 are in,** each render is `teaser-preview.mp4`, with a dark card naming every clip still missing.
