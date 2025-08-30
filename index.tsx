/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Make sure hljs is declared if it's coming from a script tag
declare const hljs: any;

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
          releaseType: "U.S. Release Only",
          details: {
            features: [
              "Visualizes CFD grids and solutions.",
              "Supports multiple grid and solution file formats.",
              "Uses OpenGL/GLUT for high-performance graphics.",
              "Provides various plotting options like vector plots, contour plots, and isosurfaces."
            ],
            repoUrl: "https://software.nasa.gov/software/ARC-14400-1"
          }
        },
        {
          id: "LAR-18934-1",
          title: "Flight Optimization System (FLOPS) Software, Version 9",
          description: "FLOPS is a multidisciplinary system of computer programs for conceptual and preliminary design and evaluation of advanced aircraft concepts.",
          releaseType: "General Public Release",
           details: {
            features: [
                "Performs detailed analysis for aircraft design.",
                "Integrates various disciplines like aerodynamics, weights, and propulsion.",
                "Optimizes for factors such as fuel efficiency and cost.",
                "Includes modules for mission analysis and performance calculation."
            ],
            repoUrl: "https://software.nasa.gov/software/LAR-18934-1"
          }
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
            { type: 'p', text: "Here are some quite complex examples of what Gemini thinking models can solve. In each of them you can select different models to see how this new model compares to its predecessors. In some cases, you'llstill get the good answer from the other models, in that case, re-run it a couple of times and you'll see that Gemini thinking models are more consistent thanks to their thinking step." },
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
  airplane: <svg viewBox="0 0 24 24"><path d="M21.4,12.6l-8-6.4V3.5c0-0.8-0.7-1.5-1.5-1.5S10.4,2.7,10.4,3.5v2.7l-8,6.4H2v1.8l8.4-3.4v6.5L8.6,19v1.5L12,19.4l3.4,1.1V19l-1.8-1.5v-6.5l8.4,3.4V12.6H21.4z"/></svg>,
  robot: <svg viewBox="0 0 24 24"><path d="M16,7H8C7.4,7,7,7.4,7,8v4c0,0.6,0.4,1,1,1h1v1c0,0.6,0.4,1,1,1h4c0.6,0,1-0.4,1-1v-1h1c0.6,0,1-0.4,1-1V8C17,7.4,16.6,7,16,7z M12,2C9.8,2,8,3.8,8,6h8C16,3.8,14.2,2,12,2z M18,17H6c-0.6,0-1,0.4-1,1s0.4,1,1,1h12c0.6,0,1-0.4,1-1S18.6,17,18,17z"/></svg>,
  bar_chart: <svg viewBox="0 0 24 24"><path d="M6,17h2V8H6V17z M11,17h2V4h-2V17z M16,17h2V12h-2V17z M4,20h16v-1H4V20z"/></svg>,
  health: <svg viewBox="0 0 24 24"><path d="M21.2,12.8c-0.2-0.5-0.6-0.8-1.2-0.8h-3.4l-1.6-4.5c-0.3-0.8-1.2-1.2-2-0.9C12.1,6.9,11.8,7.7,12,8.5L13.5,12h-3L9.1,4.5c-0.2-0.8-0.9-1.3-1.7-1.2c-0.8,0.2-1.3,0.9-1.2,1.7L7.6,12H4c-0.6,0-1,0.4-1,1s0.4,1,1,1h3.6l1,2.8L10,13.3c-0.2-0.4-0.7-0.6-1.1-0.3c-0.4,0.2-0.6,0.7-0.3,1.1l2,4.5C10.7,18.8,11,19,11.4,19c0.4,0,0.7-0.2,0.9-0.5l1.6-3.5h3.4c0.6,0,1-0.4,1-1S17.6,13,17,13h-3.4l-0.5-1.2h3.1c0.5,0,0.9-0.3,1.2-0.8L21.2,12.8z"/></svg>,
  document: <svg viewBox="0 0 24 24"><path d="M14,2H6C5.5,2,5,2.5,5,3v18c0,0.5,0.5,1,1,1h12c0.5,0,1-0.5,1-1V8L14,2z M13,8V3.5L18.5,9H14C13.4,9,13,8.6,13,8z M8,16h8v2H8V16z M8,12h8v2H8V12z"/></svg>,
  database: <svg viewBox="0 0 24 24"><path d="M12,3C7,3,3,5.2,3,8v2c0,2.8,4,5,9,5s9-2.2,9-5V8C21,5.2,17,3,12,3z M12,12.5c-4.1,0-7.5-1.8-7.5-4S7.9,4.5,12,4.5s7.5,1.8,7.5,4S16.1,12.5,12,12.5z M3,14v2c0,2.8,4,5,9,5s9-2.2,9-5v-2c0,2.8-4,5-9,5S3,16.8,3,14z"/></svg>,
  grid: <svg viewBox="0 0 24 24"><path d="M10,4H4v6h6V4z M10,14H4v6h6V14z M20,4h-6v6h6V4z M14,14h6v6h-6V14z"/></svg>,
  circuit: <svg viewBox="0 0 24 24"><path d="M4,15h4v-2H4V15z M10,13h4v2h-4V13z M16,15h4v-2h-4V15z M2,11H2v2h2v-2H2z M8,11v2h2v-2H8z M14,11v2h2v-2H14z M20,11v2h2v-2H20z M4,9h4V7H4V9z M10,7v2h4V7H10z M16,9h4V7h-4V9z M2,5H2v2h2V5H2z M8,5v2h2V5H8z M14,5v2h2V5H14z M20,5v2h2V5H20z M2,17H2v2h2v-2H2z M8,17v2h2v-2H8z M14,17v2h2v-2H14z M20,17v2h2v-2H20z M4,21h16v-2H4V21z M4,5H2v-2h2V5z M10,3v2h4V3H10z M16,5h4V3h-4V5z"/></svg>,
  leaf: <svg viewBox="0 0 24 24"><path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z M15.4,14c-1.8,1.8-4.6,1.8-6.4,0c-1.8-1.8-1.8-4.6,0-6.4C10.7,5.9,13.9,5.2,16,6.6C17.5,7.9,17,11,15.4,14z"/></svg>,
  molecule: <svg viewBox="0 0 24 24"><path d="M12,2C9.2,2,7,4.2,7,7s2.2,5,5,5s5-2.2,5-5S14.8,2,12,2z M19,10c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S20.7,10,19,10z M5,10c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S6.7,10,5,10z M12,17c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,17,12,17z"/></svg>,
  headset: <svg viewBox="0 0 24 24"><path d="M12,2C6.5,2,2,6.5,2,12v5c0,1.7,1.3,3,3,3h1v-4c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v4h4v-4c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v4h1c1.7,0,3-1.3,3-3v-5C22,6.5,17.5,2,12,2z M5,12c0-3.9,3.1-7,7-7s7,3.1,7,7v2c0,0.6-0.4,1-1,1h-3c-0.6,0-1-0.4-1-1v-2c0-2.2-1.8-4-4-4S8,9.8,8,12v2c0,0.6-0.4,1-1,1H4c-0.6,0-1-0.4-1-1V12z"/></svg>,
  rocket: <svg viewBox="0 0 24 24"><path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M15,14.1L14.1,15L12,12.9L9.9,15L9,14.1L11.1,12L9,9.9L9.9,9L12,11.1L14.1,9L15,9.9L12.9,12L15,14.1z M17,7h-2.1c-0.5-1.2-1.2-2.3-2.1-3.2l1.5-1.5c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L11.4,2.4C10.5,2.1,9.6,2,8.6,2H7v1.4C7,3.9,6.9,4.5,6.6,5H4C3.4,5,3,5.4,3,6v2c0,0.6,0.4,1,1,1h2.6c0.3,0.5,0.7,1,1.1,1.4L6,12.1c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l1.7-1.7c0.4,0.4,0.9,0.7,1.4,1.1V15c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1v-2.6c0.5-0.3,1-0.7,1.4-1.1l1.7,1.7c0.4,0.4,1,0.4,1.4,0s0.4-1,0-1.4l-1.7-1.7c0.4-0.4,0.7-0.9,1.1-1.4H17c0.6,0,1-0.4,1-1V6C18,5.4,17.6,5,17,5V3C17,2.4,16.6,2,16,2H14.1c-0.4,0.4-0.9,0.7-1.4,1.1L11,2.4C10.6,2,10,2,9.6,2.4l-1.7,1.7C7.5,4.5,7.2,5,6.8,5.4H5V7h1.4c0.1,0.5,0.3,0.9,0.5,1.3l-1.6,1.6c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l1.6-1.6c0.4,0.2,0.8,0.4,1.3,0.5V11h2v-1.4c0.5-0.1,0.9-0.3,1.3-0.5l1.6,1.6c0.4,0.4,1,0.4,1.4,0s0.4-1,0-1.4l-1.6-1.6c0.2-0.4,0.4-0.8,0.5-1.3H17V7z"/></svg>,
  cube: <svg viewBox="0 0 24 24"><path d="M21,16.5c0,0.3-0.2,0.5-0.4,0.7l-7.9,4.4c-0.2,0.1-0.4,0.2-0.6,0.2s-0.4-0.1-0.6-0.2l-7.9-4.4C3.2,17,3,16.8,3,16.5v-9C3,7.2,3.2,7,3.4,6.8l7.9-4.4c0.2-0.1,0.4-0.2,0.6-0.2s0.4,0.1,0.6,0.2l7.9,4.4C20.8,7,21,7.2,21,7.5V16.5z M12,4.1L5.5,8L12,11.9l6.5-3.9L12,4.1z M4,9.3l7,3.9v7.6L4,16.9V9.3z M13,20.8v-7.6l7-3.9v7.6L13,20.8z"/></svg>,
  gauge: <svg viewBox="0 0 24 24"><path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z M16.9,15.5l-3.4-2c-0.4-0.2-0.6-0.6-0.6-1V7c0-0.6,0.4-1,1-1s1,0.4,1,1v4.4l2.9,1.7c0.5,0.3,0.7,0.9,0.4,1.4C18.1,15.9,17.4,15.8,16.9,15.5z"/></svg>,
  capsule: <svg viewBox="0 0 24 24"><path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z M16,12c0-2.2-1.8-4-4-4s-4,1.8-4,4s1.8,4,4,4S16,14.2,16,12z"/></svg>,
  code: <svg viewBox="0 0 24 24"><path d="M9.4,16.6L4.8,12l4.6-4.6L8,6l-6,6l6,6L9.4,16.6z M14.6,16.6l4.6-4.6l-4.6-4.6L16,6l6,6l-6,6L14.6,16.6z"/></svg>,
  chevron_left: <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>,
  chevron_right: <svg viewBox="0 0 24 24"><path d="M8.59,16.59L10,18l6-6l-6-6l-1.41,1.41L13.17,12L8.59,16.59z"/></svg>,
  chevron_down: <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>,
  copy: <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-5zm0 16H8V7h11v14z"/></svg>,
  check: <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
};

// --- Components ---

const CodeBlock = ({ lang, code }) => {
    const codeRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (codeRef.current && typeof hljs !== 'undefined') {
            hljs.highlightElement(codeRef.current);
        }
    }, [code]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="code-block-wrapper">
            <pre><code ref={codeRef} className={`language-${lang}`}>{code}</code></pre>
            <button onClick={handleCopy} className="copy-button" aria-label="Copy code to clipboard">
                {isCopied ? ICONS['check'] : ICONS['copy']}
                <span className="copy-tooltip">{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
        </div>
    );
};


const CollapsibleSection = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    return (
        <div className={`collapsible-section ${isOpen ? 'open' : ''}`}>
            <h3 className="section-title" onClick={() => setIsOpen(!isOpen)}>
                <span className="arrow">{isOpen ? ICONS['chevron_down'] : ICONS['chevron_right']}</span> {title}
            </h3>
            {isOpen && <div className="section-content">{children}</div>}
        </div>
    );
};


const GeminiApiExamples = () => {
    return (
        <div className="gemini-examples-container">
            {notebookData.map((section, index) => (
                <CollapsibleSection title={section.title} key={index} startOpen={index === 0}>
                    {section.content.map((item, idx) => {
                        switch (item.type) {
                            case 'p': return <p key={idx}>{item.text}</p>;
                            case 'h4': return <h4 key={idx}>{item.text}</h4>;
                            case 'code': return <CodeBlock key={idx} lang={item.lang} code={item.code} />;
                            case 'result': return <div className="result-block" key={idx}><pre><code>{item.text}</code></pre></div>;
                            case 'thought': return <div className="thought-block" key={idx}><strong>{item.title}</strong><p>{item.text}</p></div>
                            case 'image': return <img src={item.src} alt={item.alt} key={idx} />;
                            default: return null;
                        }
                    })}
                </CollapsibleSection>
            ))}
        </div>
    );
};

const Header = ({ onToggleSidebar }) => (
    <header className="app-header">
        <button className="header-menu-toggle" onClick={onToggleSidebar} aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
        </button>
        <h1 className="header-title">AURELION AI // NASA Software Database</h1>
        <div className="system-status-panel">
            <div className="status-item">
                <span className="status-indicator"></span>
                <span>SYSTEM: NOMINAL</span>
            </div>
             <div className="status-item">
                <span>PROBE: IDLE</span>
            </div>
        </div>
    </header>
);

const Sidebar = ({ categories, activeCategoryId, onSelectCategory, onSummonProbe, isCollapsed, onToggleCollapse, isSidebarOpen }) => {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}>
      <div>
        <h2 className="sidebar-title">{catalogData.title}</h2>
        <nav>
          <ul className="nav-list">
            {categories.map((category) => (
              <li
                key={category.id}
                className={`nav-item ${activeCategoryId === category.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(category.id)}
                role="button"
                tabIndex={0}
                aria-label={category.name}
                title={isCollapsed ? category.name : ''}
              >
                <div className="nav-icon">{ICONS[category.icon]}</div>
                <span className="nav-text">{category.name}</span>
              </li>
            ))}
            <li 
              className="nav-item summon-probe" 
              onClick={onSummonProbe} 
              role="button" 
              tabIndex={0}
              title={isCollapsed ? 'Summon AURELION Probe' : ''}
            >
               <div className="nav-icon">{ICONS['robot']}</div>
               <span className="nav-text">Summon AURELION Probe</span>
            </li>
          </ul>
        </nav>
      </div>
       <button 
        className="sidebar-toggle" 
        onClick={onToggleCollapse} 
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <div className="nav-icon">
          {ICONS[isCollapsed ? 'chevron_right' : 'chevron_left']}
        </div>
      </button>
    </aside>
  );
};

const SoftwareCard = ({ item, isHighlighted }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`software-card ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="card-header">
        <h2 className="card-title">{item.title}</h2>
        <span className="card-id">{item.id}</span>
      </div>
      <p className="card-description">{item.description}</p>
      <div className="card-footer">
        <span className="card-release-type">{item.releaseType}</span>
        {item.details && (
            <button className="view-details-button" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Hide Details' : 'View Details'}
            </button>
        )}
      </div>
      {item.details && (
        <div className={`card-details ${isExpanded ? 'expanded' : ''}`}>
          {item.details.features && (
            <>
              <h4>Key Features:</h4>
              <ul>
                {item.details.features.map((feature, i) => <li key={i}>{feature}</li>)}
              </ul>
            </>
          )}
          {item.details.repoUrl && (
            <a href={item.details.repoUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
              View Repository / More Info
            </a>
          )}
        </div>
      )}
    </div>
  );
};


const ContentArea = ({ category }) => {
  if (!category) {
    return <div className="content-area">Select a category to begin.</div>;
  }

  if (category.component === 'GeminiApiExamples') {
    return (
        <main className="content-area">
            <div className="category-header">
                <h1 className="category-title">{category.name}</h1>
                <p className="category-description">{category.description}</p>
            </div>
            <GeminiApiExamples />
        </main>
    );
  }

  return (
    <main className="content-area">
      <div className="category-header">
        <h1 className="category-title">{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </div>
      <div className="software-list">
        {category.software.length > 0 ? (
          category.software.map((item, index) => (
            <SoftwareCard item={item} isHighlighted={index === 0} key={item.id} />
          ))
        ) : (
          <p>No software entries available in this category yet.</p>
        )}
      </div>
    </main>
  );
};

const App = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(catalogData.categories[0].id);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
    if (window.innerWidth <= 768) {
        setSidebarOpen(false);
    }
  };
  
  const handleToggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  }

  const activeCategory = catalogData.categories.find(c => c.id === activeCategoryId);

  return (
    <div className="App">
      <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="app-body">
        <Sidebar
          categories={catalogData.categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
          onSummonProbe={() => alert("Summoning AURELION Probe...")}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          isSidebarOpen={isSidebarOpen}
        />
        <ContentArea category={activeCategory} />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('react-root'));
root.render(<App />);