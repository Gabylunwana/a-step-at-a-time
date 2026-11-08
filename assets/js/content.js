/* =========================================================================
   ONE STEP AT A TIME — PROGRAMME CONTENT
   Original text. Structure follows the evidence-based components used in
   WHO-style guided self-help for depression: psychoeducation, behavioural
   activation, slow breathing, positive self-talk & strengths, social
   support and relapse prevention.

   Placeholders: {P} = the companion character the reader chose
                 {G} = the guide character (e.g. the health worker)
   Slide types:  story | info | checkin | exercise | summary
   ========================================================================= */
window.SBS_CONTENT = {
  sessions: [

  /* ---------------------------------------------------------------- 0 */
  {
    id: 0, short: "Start", title: "Getting started",
    minutes: 15,
    goal: "Learn how the guide works, meet your companion and take stock of how you are doing.",
    slides: [
      { type: "info", title: "Welcome",
        body: `<p>This guide is for adults who have been feeling low, stressed, tired or stuck for a while. It teaches practical skills that research has shown can lift mood and make daily life feel more manageable.</p>
               <p>There are <strong>five sessions</strong>. Each takes about 30 minutes. We suggest one session a week, with small things to practise in between. The practice is where most of the change happens.</p>` },
      { type: "info", title: "Before you begin",
        body: `<ul class="ticks">
                 <li>This is a self-help guide. It does not replace a doctor, nurse or counsellor.</li>
                 <li>Your answers are saved only on this device. Nobody else can see them unless you show them.</li>
                 <li>If at any point you feel unsafe or think about ending your life, stop and open <a href="#/help">Urgent help</a>. You deserve support straight away.</li>
               </ul>` },
      { type: "exercise", kind: "character", id: "character",
        prompt: "In this guide you will follow the story of someone going through a hard time. Choose who you would like to follow." },
      { type: "story", who: "person",
        text: "Hello, I'm {P}. For a few months now everything has felt heavy. I wake up tired, I don't enjoy things the way I used to, and I've stopped doing a lot of what I normally do." },
      { type: "story", who: "person",
        text: "A friend noticed I wasn't myself and told me to go and talk to someone at the health centre. I almost didn't go. I thought, \"What's the point?\"" },
      { type: "story", who: "guide",
        text: "Hello {P}, I'm {G}. Thank you for coming — that took courage. What you're describing is very common, and there are things that can help. We'll work on them together, one small step at a time." },
      { type: "story", who: "guide",
        text: "First, I'd like to understand how things are for you right now. We'll check in like this at the start of every session so you can see how things change." },
      { type: "checkin" },
      { type: "exercise", kind: "list", id: "s0_problems", count: 3,
        prompt: "What are the main problems you would like help with?",
        hint: "For example: \"I can't get out of bed in the morning\", \"I worry all the time about money\", \"I avoid my friends\".",
        placeholder: "A problem I'd like help with" },
      { type: "story", who: "guide",
        text: "Thank you. Now something just as important: even when life is hard, you still have strengths. They are what we'll build on." },
      { type: "exercise", kind: "choices", id: "s0_strengths", other: true,
        prompt: "Which of these are true of you, even a little? Tick as many as you like.",
        options: ["I care about my family", "I keep going even when it's hard", "I'm good with my hands", "I'm a good listener",
                  "I have faith or beliefs that matter to me", "I'm honest", "I can make people laugh", "I'm hard-working",
                  "I've survived difficult times before", "I'm kind to others", "I'm good at solving problems", "I'm willing to try"] },
      { type: "summary",
        points: ["You've taken the first step by starting this guide.",
                 "You named the problems you want help with.",
                 "You noticed some of your strengths — they're still there, even when you feel low."],
        practice: ["Have a look at your list of strengths once a day this week.",
                   "When you're ready, start Session 1."] }
    ]
  },

  /* ---------------------------------------------------------------- 1 */
  {
    id: 1, short: "1", title: "Understanding how you feel",
    minutes: 30,
    goal: "Understand the cycle of low mood and plan small, doable activities.",
    slides: [
      { type: "checkin" },
      { type: "story", who: "person",
        text: "I used to love cooking for people and going out on Sundays. Now I mostly stay inside. When people call, I let the phone ring." },
      { type: "story", who: "guide",
        text: "Thank you for telling me, {P}. When people go through stress, loss or long periods of difficulty, it is very common to feel like this. It's not weakness and it's not your fault." },
      { type: "info", title: "Signs of low mood",
        body: `<p>Feeling low for a long time can affect your whole body and life. You might notice:</p>
               <ul class="grid2">
                 <li>Feeling sad, empty or hopeless</li><li>Losing interest in things you enjoyed</li>
                 <li>Tiredness and low energy</li><li>Sleeping too much or too little</li>
                 <li>Eating more or less than usual</li><li>Finding it hard to concentrate</li>
                 <li>Feeling worthless or guilty</li><li>Aches, pains or headaches</li>
                 <li>Staying away from people</li><li>Feeling irritable or tearful</li>
               </ul>
               <p class="muted">You don't need to have all of these. Most people have a few.</p>` },
      { type: "story", who: "guide",
        text: "There's a pattern that keeps low mood going. Let me show you." },
      { type: "info", title: "The low mood cycle", visual: "cycle",
        body: `<p>When we feel low, we naturally do less. We rest more, see people less and put tasks off. That makes sense — we're tired.</p>
               <p>But doing less means fewer good moments, fewer things achieved and more problems piling up. So we feel <em>even lower</em>, and do even less.</p>
               <p><strong>The good news:</strong> the cycle can also turn the other way. Small actions bring small good moments, which give a little more energy for the next step.</p>` },
      { type: "story", who: "person",
        text: "But I don't feel like doing anything. Shouldn't I wait until I feel better?" },
      { type: "story", who: "guide",
        text: "That's what most people think. But with low mood, waiting rarely works. Action usually comes first — and the better feeling follows later. We start with steps so small they're hard to say no to." },
      { type: "info", title: "Two kinds of helpful activity",
        body: `<div class="cards2">
                 <div class="mini-card"><h4>Enjoyable</h4><p>Things that give you a moment of pleasure or calm: music, a walk, a favourite meal, sitting outside, a chat.</p></div>
                 <div class="mini-card"><h4>Getting things done</h4><p>Things that give a sense of achievement: washing clothes, fixing something, paying a bill, cooking.</p></div>
               </div>
               <p>Both lift mood. A good week has a little of each.</p>` },
      { type: "exercise", kind: "choices", id: "s1_activities", other: true,
        prompt: "Which activities did you enjoy or find useful before you started feeling low? Tick any that could still work for you.",
        options: ["Going for a walk", "Listening to music or the radio", "Cooking a meal I like", "Visiting a friend or neighbour",
                  "Attending a place of worship", "Playing or watching sport", "Spending time with children", "Tidying or fixing things at home",
                  "Reading", "Gardening or caring for plants", "Dancing or singing", "Learning something new",
                  "Doing my hair or dressing nicely", "Calling a relative"] },
      { type: "info", title: "Make it small and specific",
        body: `<p>Plans work best when they are <strong>small</strong>, <strong>specific</strong> and have a <strong>time</strong>.</p>
               <div class="compare">
                 <div class="bad"><span>Too big</span>"Get fit."</div>
                 <div class="good"><span>Better</span>"Walk to the end of my street and back after breakfast on Tuesday."</div>
               </div>
               <div class="compare">
                 <div class="bad"><span>Too big</span>"Sort out the house."</div>
                 <div class="good"><span>Better</span>"Wash the plates in the sink on Wednesday evening."</div>
               </div>` },
      { type: "story", who: "person",
        text: "OK. I could sit outside with my morning tea on Monday. And maybe cook rice and stew on Thursday, like I used to." },
      { type: "exercise", kind: "planner", id: "s1_plan", rows: 3,
        prompt: "Plan 2 or 3 small activities for this week. Include at least one enjoyable one.",
        hint: "Pick things you are almost sure you can manage. Small is good." },
      { type: "story", who: "guide",
        text: "That's a great start. Some days it will be hard, and that's alright. If you only manage part of it, that still counts. Next time we'll look at how it went." },
      { type: "summary",
        points: ["Low mood is common and it's not your fault.",
                 "Doing less keeps low mood going; small actions help break the cycle.",
                 "Action comes first — motivation often follows."],
        practice: ["Do the activities you planned, as best you can.",
                   "After each one, notice how you feel, even if the change is small.",
                   "Find your plan any time in <a href=\"#/toolbox\">My toolbox</a>."] }
    ]
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: 2, short: "2", title: "Managing stress and doing more",
    minutes: 30,
    goal: "Learn slow breathing and how to break big tasks into small steps.",
    slides: [
      { type: "checkin" },
      { type: "exercise", kind: "review", id: "s2_review", source: "s1_plan",
        prompt: "How did your planned activities go?" },
      { type: "story", who: "person",
        text: "I sat outside on Monday and it was nice — calmer than I expected. But I didn't cook on Thursday. I felt bad about it all evening." },
      { type: "story", who: "guide",
        text: "You did one of them — that's real progress. Missing one isn't failure; it's information. Let's look at what got in the way." },
      { type: "story", who: "person",
        text: "When I thought about cooking, it felt like too much: going to the market, preparing everything, cleaning afterwards." },
      { type: "info", title: "When a task feels too big, make it smaller",
        body: `<p>Big tasks feel impossible when we're low. Break them into steps, and do just the first one.</p>
               <ol class="steps">
                 <li>Write a short list of what to buy</li>
                 <li>Go to the market for those items</li>
                 <li>Wash and cut the vegetables</li>
                 <li>Cook</li>
                 <li>Wash up — or leave it for the morning</li>
               </ol>
               <p>Each step done is a success, even if you stop there.</p>` },
      { type: "exercise", kind: "list", id: "s2_steps", count: 5,
        prompt: "Choose one task you've been putting off. Break it into small steps.",
        hint: "Write the task in the first box, then the steps below it.",
        placeholder: "Step" },
      { type: "story", who: "person",
        text: "Another thing: sometimes before going out, my heart races, my chest feels tight and my mind won't stop. Then I don't go." },
      { type: "story", who: "guide",
        text: "That is your body's stress reaction. It's uncomfortable, but not dangerous. A simple way to calm it is slow breathing. Let's try it together now." },
      { type: "info", title: "Slow breathing",
        body: `<ol class="steps">
                 <li>Sit comfortably with your feet on the floor. Rest your hands in your lap.</li>
                 <li>Breathe out fully, as if letting go of everything.</li>
                 <li>Breathe in gently through your nose and let your belly rise, slowly counting 1, 2, 3, 4.</li>
                 <li>Breathe out slowly through your mouth, counting 1, 2, 3, 4, 5, 6.</li>
                 <li>Keep going for about two minutes. If your mind wanders, gently come back to counting.</li>
               </ol>
               <p class="muted">If you feel dizzy, breathe normally for a moment, then continue more gently.</p>` },
      { type: "exercise", kind: "breathing", id: "s2_breath",
        prompt: "Try it now. Follow the circle: breathe in as it grows, out as it shrinks." },
      { type: "exercise", kind: "scale", id: "s2_breath_effect",
        prompt: "How calm do you feel now, compared with before?",
        min: "Less calm", max: "Much calmer" },
      { type: "story", who: "guide",
        text: "Practise slow breathing once a day when you're fairly calm, so it's easier to use when you're stressed — like before doing something difficult." },
      { type: "exercise", kind: "planner", id: "s2_plan", rows: 3,
        prompt: "Plan activities for this week. Try to include the first step of your big task, and one enjoyable thing.",
        hint: "You can repeat activities that went well last week." },
      { type: "summary",
        points: ["Missing a plan is information, not failure.",
                 "Break big tasks into small steps and start with the first.",
                 "Slow breathing calms the body's stress reaction."],
        practice: ["Practise slow breathing once a day (find it in <a href=\"#/toolbox\">My toolbox</a>).",
                   "Do your planned activities, including one step of your big task.",
                   "Use slow breathing before anything that makes you nervous."] }
    ]
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: 3, short: "3", title: "Kinder thoughts and your strengths",
    minutes: 30,
    goal: "Notice harsh self-talk, practise kinder thoughts and remember what you've overcome.",
    slides: [
      { type: "checkin" },
      { type: "exercise", kind: "review", id: "s3_review", source: "s2_plan",
        prompt: "How did last week's activities go?" },
      { type: "story", who: "person",
        text: "I went to the market and cooked! But then I burned the stew a bit and thought, \"I can't even do this properly. I'm useless.\"" },
      { type: "story", who: "guide",
        text: "You went to the market and cooked a meal — two things you couldn't face last week. And yet the voice in your head called you useless. Let's look at that voice." },
      { type: "info", title: "The harsh inner voice",
        body: `<p>When we feel low, our thoughts often become harsh and unfair. Common patterns:</p>
               <ul class="patterns">
                 <li><strong>All-or-nothing:</strong> "If it isn't perfect, it's a failure."</li>
                 <li><strong>Harsh labels:</strong> "I'm useless." "I'm a burden."</li>
                 <li><strong>Expecting the worst:</strong> "It will go badly, so why try?"</li>
                 <li><strong>Ignoring the good:</strong> "That doesn't count."</li>
               </ul>
               <p>These thoughts feel true, but they are a symptom of low mood — not facts about you.</p>` },
      { type: "story", who: "guide",
        text: "Here's a useful question: if a good friend burned their stew, would you call them useless?" },
      { type: "story", who: "person",
        text: "No… I'd say, \"Well done for cooking — it still tastes good.\"" },
      { type: "info", title: "Positive self-talk",
        body: `<p>Positive self-talk isn't pretending everything is fine. It means speaking to yourself the way a kind, fair friend would.</p>
               <div class="compare"><div class="bad"><span>Harsh</span>"I'm useless."</div><div class="good"><span>Kinder</span>"I'm finding things hard right now, but I cooked today. That's a step."</div></div>
               <div class="compare"><div class="bad"><span>Harsh</span>"Nobody wants to see me."</div><div class="good"><span>Kinder</span>"I don't know that. Some people have asked about me."</div></div>
               <div class="compare"><div class="bad"><span>Harsh</span>"This will never get better."</div><div class="good"><span>Kinder</span>"It's hard now. I've already made small changes, and I can keep going."</div></div>` },
      { type: "exercise", kind: "pairs", id: "s3_swaps", count: 3,
        prompt: "Write down a harsh thought you've had recently. Then write what a kind, fair friend might say instead.",
        left: "Harsh thought", right: "Kinder thought" },
      { type: "story", who: "guide",
        text: "Remember the strengths you noticed when we first met? Let's add to them. Think about difficult times you've already come through." },
      { type: "exercise", kind: "list", id: "s3_overcome", count: 3,
        prompt: "What difficult times have you got through before? What helped you?",
        placeholder: "Something I got through, and what helped" },
      { type: "exercise", kind: "text", id: "s3_phrase",
        prompt: "Write one kind sentence you can say to yourself when things get hard.",
        placeholder: "e.g. \"One step at a time. I've done hard things before.\"" },
      { type: "exercise", kind: "planner", id: "s3_plan", rows: 3,
        prompt: "Plan this week's activities. Keep one or two that are going well, and add something new." },
      { type: "summary",
        points: ["Harsh thoughts are a symptom of low mood, not facts.",
                 "Talk to yourself like a kind, fair friend.",
                 "You've overcome hard things before — those strengths are still yours."],
        practice: ["When you notice a harsh thought, write a kinder one in <a href=\"#/toolbox\">My toolbox</a>.",
                   "Say your kind sentence to yourself each day.",
                   "Keep doing your planned activities and slow breathing."] }
    ]
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: 4, short: "4", title: "Connecting with others",
    minutes: 30,
    goal: "Understand how support helps and take a small step to reconnect.",
    slides: [
      { type: "checkin" },
      { type: "exercise", kind: "review", id: "s4_review", source: "s3_plan",
        prompt: "How did last week's activities go?" },
      { type: "story", who: "person",
        text: "Things are a bit better. But I realise I've cut myself off. I don't want to bother people with my problems." },
      { type: "story", who: "guide",
        text: "Many people feel that way. But being with others — even briefly — is one of the strongest protections for our mood. And support isn't only about talking about problems." },
      { type: "info", title: "Different kinds of support",
        body: `<div class="cards2">
                 <div class="mini-card"><h4>Company</h4><p>Simply being with someone: sharing a meal, watching a match, sitting together.</p></div>
                 <div class="mini-card"><h4>Listening</h4><p>Someone you can talk to honestly about how you feel.</p></div>
                 <div class="mini-card"><h4>Practical help</h4><p>Help with tasks: childcare, a lift, borrowing something.</p></div>
                 <div class="mini-card"><h4>Advice and information</h4><p>Someone who knows about jobs, health, services or your situation.</p></div>
               </div>
               <p>Support can come from family, friends, neighbours, colleagues, a faith community, community groups, or health and social workers.</p>` },
      { type: "exercise", kind: "list", id: "s4_people", count: 4,
        prompt: "Who could you connect with, even a little? Think of people, groups or places.",
        hint: "Include people you've lost touch with. They may be glad to hear from you.",
        placeholder: "Person, group or place" },
      { type: "story", who: "person",
        text: "My cousin used to call every week. I stopped answering. I'm embarrassed to call now." },
      { type: "story", who: "guide",
        text: "That's understandable. You don't need to explain everything. A short message is enough to start — something like, \"I've been thinking of you. How are you?\"" },
      { type: "info", title: "Reconnecting, step by step",
        body: `<ol class="steps">
                 <li>Choose one person from your list.</li>
                 <li>Pick a small way to make contact: a text, a short call, a greeting at church or mosque, a visit.</li>
                 <li>Decide what you'll say. Keep it simple.</li>
                 <li>Use slow breathing beforehand if you feel nervous.</li>
                 <li>Afterwards, notice how you feel — and be kind to yourself whatever happens.</li>
               </ol>` },
      { type: "exercise", kind: "text", id: "s4_step",
        prompt: "What is one small step you'll take this week to connect with someone? What will you say?",
        placeholder: "e.g. \"Send a message to my cousin on Saturday: 'Thinking of you, how is the family?'\"" },
      { type: "exercise", kind: "planner", id: "s4_plan", rows: 3,
        prompt: "Plan this week's activities, including your step to connect with someone." },
      { type: "summary",
        points: ["Connection protects mood — even short, simple contact.",
                 "Support comes in many forms: company, listening, practical help, advice.",
                 "Start small. A short message is enough."],
        practice: ["Take your step to connect with someone.",
                   "Keep doing your planned activities, slow breathing and kind self-talk."] }
    ]
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: 5, short: "5", title: "Staying well",
    minutes: 30,
    goal: "Look back on your progress and make a plan for difficult times ahead.",
    slides: [
      { type: "checkin" },
      { type: "exercise", kind: "review", id: "s5_review", source: "s4_plan",
        prompt: "How did last week's activities go?" },
      { type: "story", who: "person",
        text: "I messaged my cousin and we talked for an hour. It felt good. I'm doing more than I was five weeks ago. But I'm scared the heavy feeling will come back." },
      { type: "story", who: "guide",
        text: "Look how far you've come, {P}. It's normal to have ups and downs. A bad day doesn't mean you're back at the start. Let's make a plan so you know what to do if things get harder." },
      { type: "exercise", kind: "progress", id: "s5_progress",
        prompt: "Here's how your check-ins have changed over the programme." },
      { type: "info", title: "Your toolbox",
        body: `<ul class="tools-recap">
                 <li><strong>Small activities</strong> — plan enjoyable and useful things, small and specific.</li>
                 <li><strong>Breaking tasks down</strong> — make big tasks into small steps; start with the first.</li>
                 <li><strong>Slow breathing</strong> — calm your body when stressed.</li>
                 <li><strong>Kinder self-talk</strong> — speak to yourself like a fair friend.</li>
                 <li><strong>Your strengths</strong> — remember what you've already come through.</li>
                 <li><strong>Connecting</strong> — keep in touch with people who matter to you.</li>
               </ul>` },
      { type: "exercise", kind: "choices", id: "s5_helped",
        prompt: "Which tools helped you most?",
        options: ["Planning small activities", "Breaking tasks into steps", "Slow breathing",
                  "Kinder self-talk", "Remembering my strengths", "Connecting with others"] },
      { type: "exercise", kind: "list", id: "s5_signs", count: 4,
        prompt: "What are your early warning signs that your mood is dropping?",
        hint: "For example: sleeping much more, not answering calls, skipping meals, staying in bed.",
        placeholder: "A warning sign" },
      { type: "exercise", kind: "list", id: "s5_actions", count: 4,
        prompt: "If you notice those signs, what will you do?",
        hint: "Go back to the tools that helped you. Be specific.",
        placeholder: "Something I'll do" },
      { type: "exercise", kind: "list", id: "s5_contacts", count: 3,
        prompt: "Who will you contact if things get hard? (Include a health worker or service.)",
        placeholder: "Name and how to reach them" },
      { type: "story", who: "guide",
        text: "If your mood drops for more than two weeks despite using your tools, or if you ever think about ending your life, please speak to a health worker straight away. Asking for help is a strength." },
      { type: "exercise", kind: "text", id: "s5_hopes",
        prompt: "What would you like to keep working on over the coming weeks?",
        placeholder: "My hopes and next steps" },
      { type: "story", who: "person",
        text: "Thank you, {G}. I know there will still be hard days. But now I know what to do, one step at a time." },
      { type: "summary", final: true,
        points: ["You have completed all five sessions — well done.",
                 "Ups and downs are normal; a bad day is not a step back to the start.",
                 "Your staying-well plan is saved in <a href=\"#/toolbox\">My toolbox</a> and your <a href=\"#/workbook\">Workbook</a>."],
        practice: ["Keep planning small activities each week.",
                   "Look at your staying-well plan once a month.",
                   "You can repeat any session whenever you like."] }
    ]
  }
  ]
};
