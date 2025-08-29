/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// --- DATA: Extracted from NASA Software Catalog PDF ---
const catalogData = {
  title: "NASA Software Catalog 2025-2026",
  categories: [
    {
      id: "aeronautics",
      name: "Aeronautics",
      icon: "airplane",
      description: "Air Traffic Management Tools, Modeling and Simulation Tools",
      software: [
        {
          id: "ARC-14400-1",
          title: "PLOT3D, Version 4.1",
          description: "PLOT3D is a computer graphics program designed to visualize the grid and solutions of structured computational fluid dynamics (CFD) datasets. Version 4.1 uses the OpenGL/GLUT graphics library.",
          releaseType: "U.S. Release Only"
        },
        {
          id: "LAR-18934-1",
          title: "Flight Optimization System (FLOPS) Software, Version 9",
          description: "FLOPS is a multidisciplinary system of computer programs for conceptual and preliminary design and evaluation of advanced aircraft concepts.",
          releaseType: "General Public Release"
        },
        {
          id: "LAR-20188-1",
          title: "FUN3D, Version 14.1",
          description: "FUN3D version 14.1 is a suite of computational fluid dynamics simulation and design tools that uses mixed-element unstructured grids to solve the Navier-Stokes equations for static and dynamic applications.",
          releaseType: "U.S. Release Only"
        },
        {
          id: "ARC-18198-1",
          title: "ADOPT: Automatic Discovery of Precursors in Time Series",
          description: "A data mining/machine learning algorithm that analyzes large volumes of historical data to find complex trends among several sensory variables simultaneously to find precursors.",
          releaseType: "Open Source"
        }
      ]
    },
    {
      id: "autonomous_systems",
      name: "Autonomous Systems",
      icon: "robot",
      description: "Robotics, Automated Systems, Systems Health Monitoring",
      software: [
         {
          id: "MFS-33014-1",
          title: "Smartphone Video Guidance Sensor (SVGS)",
          description: "The Smartphone Video Guidance Sensor (SVGS) allows for calculation of the distance and orientation of an object relative to the SVGS. A known retroreflective target pattern is mounted on the target object.",
          releaseType: "U.S. Release Only"
        },
        {
          id: "ARC-18869-1",
          title: "Activity Planning with Resources for the Exploration of Space (APRES)",
          description: "APRES is a mixed-initiative mission planning system for ground operations. APRES has a web-based user interface that is integrated with the Open-source Mission Control Technologies (OpenMCT) system.",
          releaseType: "U.S. and Foreign Release"
        }
      ]
    },
     { id: 'business_systems', name: 'Business Systems', icon: 'bar_chart', description: 'Acquisitions, Business Processes, Property Management, Risk Management, Scheduling', software: [] },
     { id: 'crew_life_support', name: 'Crew and Life Support', icon: 'health', description: 'Biological Sensors, Food, Medical, Biological Analysis, Crew Support', software: [] },
     { id: 'data_image_processing', name: 'Data & Image Processing', icon: 'document', description: 'Algorithms, Data Analysis, Data Processing', software: [] },
     { id: 'data_servers', name: 'Data Servers & Handling', icon: 'database', description: 'Algorithms, Data Management, Routers, Servers, Storage', software: [] },
     { id: 'design_integration', name: 'Design & Integration', icon: 'grid', description: 'Vehicle/Payload Modeling and Analysis, Component and Integrated System Simulation', software: [] },
     { id: 'electronics_power', name: 'Electronics & Power', icon: 'circuit', description: 'Solar Arrays, Batteries, Cabling, Grounding, Converters, Electrical Analysis', software: [] },
     { id: 'environmental_science', name: 'Environmental Science', icon: 'leaf', description: 'Terrestrial Environments, Planetary Atmospheric Modeling, Radiation Shielding', software: [] },
     { id: 'materials_processing', name: 'Materials & Processing', icon: 'molecule', description: 'Parts, Manufacturing, Production Processes, Composites', software: [] },
     { id: 'operations', name: 'Operations', icon: 'headset', description: 'Ground Software, Telemetry, Command and Control, Global Positioning Systems', software: [] },
     { id: 'propulsion', name: 'Propulsion', icon: 'rocket', description: 'Propellants, Cryogenics, Engine and Motor Performance Analysis', software: [] },
     { id: 'structures_mechanisms', name: 'Structures & Mechanisms', icon: 'cube', description: 'Deployables, Structural Loading Analysis and Design', software: [] },
     { id: 'system_testing', name: 'System Testing', icon: 'gauge', description: 'Acoustics, Shock, Vibration, Thermal Vacuum, Leak and Pressure Testing', software: [] },
     { id: 'vehicle_management', name: 'Vehicle Management', icon: 'capsule', description: 'Flight Software, Spacecraft Processes, Command and Data Handling', software: [] },
     {
        id: "gemini_api_examples",
        name: "Gemini API Examples",
        icon: "code",
        description: "Live demonstrations from a Colab notebook showcasing Gemini's advanced 'thinking' capabilities, including adaptive thinking, problem-solving, and multimodal reasoning.",
        component: 'GeminiApiExamples',
      }
  ]
};

// --- DATA: Gemini API Examples ---
const notebookData = [
    {
        title: "Installation and Setup",
        content: [
            { type: 'p', text: "The new Google Gen AI SDK provides programmatic access to Gemini models using both the Google AI for Developers and Vertex AI APIs. With a few exceptions, code that runs on one platform will run on both. This means that you can prototype an application using the Developer API and then migrate the application to Vertex AI without rewriting your code." },
            { type: 'h4', text: 'Install SDK' },
            { type: 'code', lang: 'bash', code: "%pip install -U -q \"google-genai>=1.16.0\"" },
            { type: 'h4', text: 'Setup your API key' },
            { type: 'p', text: "To run the following cell, your API key must be stored it in a Colab Secret named GOOGLE_API_KEY. If you don't already have an API key, or you're not sure how to create a Colab Secret, see Authentication for an example." },
            { type: 'code', lang: 'python', code: "from google.colab import userdata\n\nGOOGLE_API_KEY=userdata.get('GOOGLE_API_KEY')" },
            { type: 'h4', text: 'Initialize SDK client' },
            { type: 'p', text: "With the new SDK you now only need to initialize a client with you API key (or OAuth if using Vertex AI). The model is now set in each call." },
            { type: 'code', lang: 'python', code: `from google import genai
from google.genai import types

client = genai.Client(api_key=GOOGLE_API_KEY)

MODEL_ID="gemini-2.5-flash-preview-05-20"`},
            { type: 'h4', text: 'Imports' },
            { type: 'code', lang: 'python', code: `import json
from PIL import Image
from IPython.display import display, Markdown` },
        ]
    },
    {
        title: 'Using the thinking models',
        content: [
            { type: 'p', text: "Here are some quite complex examples of what Gemini thinking models can solve. In each of them you can select different models to see how this new model compares to its predecessors. In some cases, you'll still get the good answer from the other models, in that case, re-run it a couple of times and you'll see that Gemini thinking models are more consistent thanks to their thinking step." },
            { type: 'h4', text: 'Using adaptive thinking' },
            { type: 'p', text: "You can start by asking the model to explain a concept and see how it does reasoning before answering. Starting with the adaptive thinking_budget - which is the default when you don't specify a budget - the model will dynamically adjust the budget based on the complexity of the request. The animal it should find is a Platypus, but as you'll see it is not the first answer it thinks of depending on how much thinking it does." },
            { type: 'code', lang: 'python', code: `prompt = """
    You are playing the 20 question game. You know that what you are looking for
    is a aquatic mammal that doesn't live in the sea, is venomous and that's
    smaller than a cat. What could that be and how could you make sure?
"""

response = client.models.generate_content(
    model=MODEL_ID,
    contents=prompt
)

Markdown(response.text)`},
            { type: 'result', text: `This is a fantastic set of clues! It points to a very specific and unusual animal.

Based on your clues, what you are looking for is almost certainly a Platypus.

Here's why:

*   **Aquatic Mammal:** Yes, they are semi-aquatic mammals.
*   **Doesn't live in the sea:** They are found in freshwater rivers and streams in eastern Australia and Tasmania.
*   **Venomous:** This is the most unique clue for a mammal. Male platypuses possess a venomous spur on their hind legs, which can inflict considerable pain on humans and be lethal to smaller animals.
*   **Smaller than a cat:** An adult platypus typically ranges from 30 to 45 cm (12-18 inches) in body length, plus a tail, and weighs between 0.7 to 2.4 kg (1.5-5.3 lbs), which is generally smaller than an average domestic cat.

**How you could make sure (in the 20 questions game):**

To confirm it's a platypus, you'd want to ask questions that narrow down to its unique characteristics...` },
      { type: 'p', text: "Looking to the response metadata, you can see not only the amount of tokens on your input and the amount of tokens used for the response, but also the amount of tokens used for the thinking step - As you can see here, the model used around 1400 tokens in the thinking steps:"},
      { type: 'code', lang: 'python', code: `print("Prompt tokens:",response.usage_metadata.prompt_token_count)
print("Thoughts tokens:",response.usage_metadata.thoughts_token_count)
print("Output tokens:",response.usage_metadata.candidates_token_count)
print("Total tokens:",response.usage_metadata.total_token_count)` },
      { type: 'result', text: `Prompt tokens: 59
Thoughts tokens: 1451
Output tokens: 815
Total tokens: 2325`},
            { type: 'h4', text: 'Disabling the thinking steps' },
      { type: 'p', text: "You can also disable the thinking steps by setting the thinking_budget to 0. You'll see that in this case, the model doesn't think of the platypus as a possible answer. NOTE: For now, you can disable the thinking steps when using the gemini-2.5-flash-preview-05-20 model."},
      { type: 'code', lang: 'python', code: `response = client.models.generate_content(
  model=MODEL_ID,
  contents=prompt,
  config=types.GenerateContentConfig(
    thinking_config=types.ThinkingConfig(
      thinking_budget=0
    )
  )
)

Markdown(response.text)`},
      { type: 'result', text: `This is a fun and tricky one, because aquatic mammal that doesn't live in the sea, is venomous, and smaller than a cat sounds like it doesn't exist! Let's break it down and see if we can find a plausible (even if highly improbable) answer, and then how to confirm.

...my best guess is a Freshwater Water Shrew (e.g., American Water Shrew or Eurasian Water Shrew).`},
      { type: 'p', text: "Now you can see that the response is faster as the model didn't perform any thinking step. Also you can see that no tokens were used for the thinking step:"},
      { type: 'code', lang: 'python', code: `print("Prompt tokens:",response.usage_metadata.prompt_token_count)
print("Thoughts tokens:",response.usage_metadata.thoughts_token_count)
print("Output tokens:",response.usage_metadata.candidates_token_count)
print("Total tokens:",response.usage_metadata.total_token_count)`},
      { type: 'result', text: `Prompt tokens: 59
Thoughts tokens: None
Output tokens: 688
Total tokens: 747`},
        ]
    },
    {
      title: "Solving a physics problem",
      content: [
        {type: 'p', text: "Now, try with a simple physics comprehension example. First you can disable the thinking_budget to see how the model performs:"},
        {type: 'code', lang: 'python', code: `prompt = """
    A cantilever beam of length L=3m has a rectangular cross-section (width b=0.1m, height h=0.2m) and is made of steel (E=200 GPa).
    It is subjected to a uniformly distributed load w=5 kN/m along its entire length and a point load P=10 kN at its free end.
    Calculate the maximum bending stress (σ_max).
"""

response = client.models.generate_content(
    model=MODEL_ID,
    contents=prompt,
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=0
        )
    )
)`},
    {type: 'result', text: `Here's how to calculate the maximum bending stress for the given cantilever beam:
...
Therefore, the maximum bending stress (σ_max) in the cantilever beam is approximately 78.75 MPa.`},
    {type: 'p', text: "You can see that the model used no tokens for the thinking step:"},
    {type: 'code', lang: 'python', code: `print("Prompt tokens:",response.usage_metadata.prompt_token_count)
print("Thoughts tokens:",response.usage_metadata.thoughts_token_count)
print("Output tokens:",response.usage_metadata.candidates_token_count)
print("Total tokens:",response.usage_metadata.total_token_count)`},
    {type: 'result', text: `Prompt tokens: 96
Thoughts tokens: None
Output tokens: 1004
Total tokens: 1100`},
    {type: 'p', text: "Then you can set a fixed maximum budget (thinking_budget=4096, or 4096 tokens) for the thinking step to see how the model performs. You can see that, even producing a similar result for the same prompt, the amount of details shared in the answer makes it deeper and more consistent."},
    {type: 'code', lang: 'python', code: `response = client.models.generate_content(
    model=MODEL_ID,
    contents=prompt,
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=4096
        )
    )
)`},
    {type: 'result', text: `To calculate the maximum bending stress (σ_max) in the cantilever beam, we need to follow these steps:
...
The maximum bending stress (σ_max) is 78.75 MPa.`},
     { type: 'code', lang: 'python', code: `print("Prompt tokens:",response.usage_metadata.prompt_token_count)
print("Thoughts tokens:",response.usage_metadata.thoughts_token_count,"/",thinking_budget)
print("Output tokens:",response.usage_metadata.candidates_token_count)
print("Total tokens:",response.usage_metadata.total_token_count)`},
      { type: 'result', text: `Prompt tokens: 96
Thoughts tokens: 1458 / 4096
Output tokens: 1082
Total tokens: 2636`},
      ]
    },
    {
        title: 'Working with multimodal problems',
        content: [
            { type: 'p', text: "This geometry problem requires complex reasoning and is also using Gemini multimodal abilities to read the image. In this case, you are fixing a value to the thinking_budget so the model will use up to 8196 tokens for the thinking step." },
            { type: 'image', src: 'https://storage.googleapis.com/generativeai-downloads/images/geometry.png', alt: 'Geometry problem with a triangle and a circle sector' },
            { type: 'code', lang: 'python', code: `im = Image.open("geometry.png").resize((256,256))
prompt = "What's the area of the overlapping region?"
response = client.models.generate_content(
    model=MODEL_ID,
    contents=[im, prompt],
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=8192
        )
    )
)` },
            { type: 'result', text: `The area of the overlapping region is 4.5.` }
        ]
    },
    {
        title: "Solving brain teasers",
        content: [
            { type: 'p', text: "Here's another brain teaser based on an image, this time it looks like a mathematical problem, but it cannot actually be solved mathematically. If you check the thoughts of the model you'll see that it will realize it and come up with an out-of-the-box solution." },
            { type: 'image', src: 'https://storage.googleapis.com/generativeai-downloads/images/pool.png', alt: 'Pool balls with numbers 7, 9, 11, 13' },
             { type: 'code', lang: 'python', code: `prompt = "How do I use those three pool balls to sum up to 30?"
response = client.models.generate_content(
    model=MODEL_ID,
    contents=[im, prompt]
)` },
            { type: 'result', text: `This is a classic riddle!

You need to flip the 9 ball upside down to make it a 6.

Then, you can use:

6 (the flipped 9 ball)
11
13
6 + 11 + 13 = 30` }
        ]
    },
    {
        title: "Working thoughts summaries",
        content: [
            { type: 'p', text: "Summaries of the model's thinking reveal its internal problem-solving pathway. Users can leverage this feature to check the model's strategy and remain informed during complex tasks." },
            { type: 'code', lang: 'python', code: `prompt = """
  Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue.
  The person who lives in the red house owns a cat.
  Bob does not live in the green house.
  Carol owns a dog.
  The green house is to the left of the red house.
  Alice does not own a cat.
  Who lives in each house, and what pet do they own?
"""

response = client.models.generate_content(
  model=MODEL_ID,
  contents=prompt,
  config=types.GenerateContentConfig(
    thinking_config=types.ThinkingConfig(
      include_thoughts=True
    )
  )
)` },
            { type: 'thought', title: 'Thoughts summary:', text: `Logical Puzzle Breakdown and Solution

Alright, let's tackle this puzzle! I need to determine who lives in each colored house (red, green, blue) and what pet they own (cat, dog, or potentially no pet).

First, I identified the key components: people (Alice, Bob, Carol), houses (red, green, blue), and pets (cat, dog, and implicitly, potentially no pet). I laid out the initial clues: Carol owns a dog, the red house owner has a cat, Alice doesn't own a cat, Bob's not in the green house, the green house is left of the red house.

My strategy? A mental grid would work well, but it seems simple enough to manage in my head.` },
            { type: 'result', text: `Let's break down the clues step-by-step:

Red House: Bob lives here and owns a cat.
Green House: Carol, who owns a dog.
Blue House: Alice, who owns no pet.`}
        ]
    }
];


// --- SVG Icons ---
const ICONS = {
  airplane: <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
  robot: <svg viewBox="0 0 24 24"><path d="M12 2c-3.31 0-6 2.69-6 6 0 .76.15 1.48.41 2.16C4.43 11.23 2 14.57 2 18v2h20v-2c0-3.43-2.43-6.77-4