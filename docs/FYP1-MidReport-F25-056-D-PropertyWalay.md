

## Property Walay
## Project Team
Hammad Zahid   22I-2433
Shazer Nadeem   22I-2043
Moaz Murtaza22I-1902
## Session 2022-2026
Supervised by
## Dr. Adil Majeed
Department of Computer Science
National University of Computer and Emerging Sciences
## Islamabad, Pakistan
## June, 2026

## Contents
## 1    Introduction11
1.1Problem Statement    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .11
1.2Scope   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .22
1.3Modules  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .33
1.3.1Natural Language Understanding (NLU) Module   .  .  .  .  .  .  .  .  .33
1.3.2AI-Powered Recommendation Engine   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .33
1.3.3Real-Time Listings Integration Module    .  .  .  .  .  .  .  .  .  .  .  .  .  .33
1.3.4Property Tracking and Notification Module   .  .  .  .  .  .  .  .  .  .  .  .33
1.3.5Investment Insights and Trends Module   .  .  .  .  .  .  .  .  .  .  .  .  .  .33
1.3.6Meeting Automation Module  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .44
1.3.7Automated Presentation Generation Module  .  .  .  .  .  .  .  .  .  .  .  .44
1.3.8Location-Based Video Generation Module  .  .  .  .  .  .  .  .  .  .  .  .  .44
1.3.9User History and Profile Management Module .  .  .  .  .  .  .  .  .  .  .44
1.3.10   Multilingual and Voice Interface Module .  .  .  .  .  .  .  .  .  .  .  .  .  .55
1.4User Classes and Characteristics   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .55
## 2    Project Requirements77
2.1Use-case/Event Response Table .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .88
2.2Functional Requirements   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1111
2.2.1Natural Language Understanding (NLU) Module   .  .  .  .  .  .  .  .  .1111
2.2.2AI-Powered Recommendation Engine   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1111
2.2.3Real-Time Listings Integration Module    .  .  .  .  .  .  .  .  .  .  .  .  .  .1212
2.2.4Property Tracking and Notification Module   .  .  .  .  .  .  .  .  .  .  .  .1212
2.2.5Investment Insights and Trends Module   .  .  .  .  .  .  .  .  .  .  .  .  .  .1212
2.2.6Meeting Automation Module  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1212
2.2.7Automated Presentation Generation Module  .  .  .  .  .  .  .  .  .  .  .  .1313
2.2.8Location-Based Video Generation Module  .  .  .  .  .  .  .  .  .  .  .  .  .1313
2.2.9User History and Profile Management Module .  .  .  .  .  .  .  .  .  .  .1313
2.2.10   Multilingual and Voice Interface Module .  .  .  .  .  .  .  .  .  .  .  .  .  .1414
2.3Non-Functional Requirements    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1414
2.3.1Performance .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1414
2.3.2Reliability  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1414
## 2

## CONTENTS
2.3.3Usability    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1515
2.3.4Security  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1515
2.3.5Scalability .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1515
2.3.6Compatibility  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1616
2.3.7Maintainability   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1616
## 3    System Overview1717
3.1Architectural Design    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1717
3.1.1Box and Line Diagram   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1818
3.1.2Four-Tier Architecture   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1919
3.1.2.1Presentation Layer  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2020
3.1.2.2Application Layer   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2020
3.1.2.3Integration Layer  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2121
3.1.2.4Data Layer   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2222
3.1.3Architecture Benefits  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2222
3.2Design Models    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2424
3.2.1Activity Diagram   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2424
3.2.1.1Property Search Flow    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2525
3.2.1.2Property Selection and PPT Generation  .  .  .  .  .  .  .  .  .2525
3.2.1.3Meeting Scheduling Flow   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2525
3.2.1.4Agent Response Handling   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2626
3.2.1.5Key Decision Points   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2626
3.2.1.6System Benefits Illustrated .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2727
3.2.2Data Flow Diagram  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2727
3.2.2.1DFD Level 0 - Context Diagram  .  .  .  .  .  .  .  .  .  .  .  .  .2727
3.2.2.2DFD Level 1   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2828
3.2.2.3DFD Level 2 - AI-Powered Property Recommendation  .3131
3.2.2.4DFD Level 2 - Content Generation (PPT & Video)   .  .  .3333
3.2.2.5DFD Level 2 - Meeting Automation  .  .  .  .  .  .  .  .  .  .  .3636
3.2.3System-level Sequence Diagram   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .3939
3.2.3.1Process Natural Language Query    .  .  .  .  .  .  .  .  .  .  .  .4040
3.2.3.2Search Properties .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4040
3.2.3.3View Property Details   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4141
3.2.3.4Save Property .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4141
3.2.3.5Get Saved Properties  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4242
3.2.3.6Generate PPT .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4242
3.2.3.7Generate Property Video  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4343
3.2.3.8Request Agent Meeting    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4343
3.2.3.9Agent Accepts Meeting    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4444
3.2.3.10   Get Search History  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4444
## 3

## CONTENTS
3.2.3.11   Compare Properties    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4545
3.2.3.12   Get Investment Insights    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4545
3.2.3.13   Track Property Updates   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4646
3.2.3.14   Fetch Listings from External Source .  .  .  .  .  .  .  .  .  .  .4646
3.3Data Design  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4747
3.3.1Properties Table  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4747
3.3.2Property Price History Table   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4848
3.3.3Property Last Updates Table   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4949
3.3.4Saved Properties Table   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4949
3.3.5App Users Table    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4949
3.3.6Property Reviews and Comments Tables  .  .  .  .  .  .  .  .  .  .  .  .  .  .5050
3.3.7Search Logs and Property Views Tables   .  .  .  .  .  .  .  .  .  .  .  .  .  .5151
3.3.8Price Alert Subscriptions Table  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .5151
3.3.9Notifications Table   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .5252
3.3.10   Relational Integrity  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .5252
## 4

List of Figures
2.1Use case diagram for PropertyWalay  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .88
3.1Box and Line Diagram of PropertyWalay System   .  .  .  .  .  .  .  .  .  .  .  .  .1818
3.2Four-Tier Architecture of PropertyWalay System    .  .  .  .  .  .  .  .  .  .  .  .  .1919
3.3Activity Diagram of PropertyWalay System   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .2424
3.4Context Diagram of the PropertyWalay System    .  .  .  .  .  .  .  .  .  .  .  .  .  .2828
3.5DFD Level 1 Diagram of the PropertyWalay System .  .  .  .  .  .  .  .  .  .  .  .2929
3.6DFD Level 2 Diagram of AI-Powered Property Recommendation .  .  .  .  .3232
3.7DFD Level 2 Diagram of Content Generation (PPT & Video)  .  .  .  .  .  .  .3434
3.8DFD Level 2 Diagram of Meeting Automation .  .  .  .  .  .  .  .  .  .  .  .  .  .  .3737
3.9System Sequence Diagram for Process Natural Language Query function
(NLU Module)    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
## 4040
3.10  System  Sequence  Diagram  for  Search  Properties  function  (AI  Recom-
mendation Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4040
3.11  System Sequence Diagram for View Property Details function (Database
Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4141
3.12  System Sequence Diagram for Save Property function (Database Module)4141
3.13  System Sequence Diagram for Get Saved Properties function (Database
Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
## 4242
3.14  System Sequence Diagram for Generate PPT function (Automation Module)4242
3.15  System  Sequence  Diagram  for  Generate  Property  Video  function  (Au-
tomation Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4343
3.16  System Sequence Diagram for Request Agent Meeting function (Automa-
tion Module) .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4343
3.17  System Sequence Diagram for Agent Accepts Meeting function (Automa-
tion Module) .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4444
3.18  System  Sequence  Diagram  for  Get  Search  History  function  (Database
Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4444
3.19  System Sequence Diagram for Compare Properties function (AI Recom-
mendation Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .4545
3.20  System Sequence Diagram for Get Investment Insights function (AI Rec-
ommendation Module)   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
## 4545
## 5

## LIST OF FIGURES
3.21  System Sequence Diagram for Track Property Updates function (Automa-
tion Module) .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
## 4646
3.22  System Sequence Diagram for Fetch Listings from External Source func-
tion (Integration Module)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
## 4646
## 6

List of Tables
1.1Detailing the Problem Statement   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .22
1.2User Classes and Characteristics   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .66
2.1Use-case/Event Response Table .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .1111
## 0

## Chapter 1
## Introduction
PropertyWalay is an AI-powered real estate chatbot we’ve built specifically for Pakistan’s
property market.   We wrote this document to help everyone involved understand what
we’re building and why.  If you’re a developer, you’ll find all the technical details about
how our chatbot and AI recommendation engine work.   Project managers can use this
to see how we’re doing and make sure we’re on track.  Our marketing team will learn
about what makes our product special and who we’re building it for. Property seekers and
agents will understand what the platform can actually do for them.  And testers can use
this to figure out what needs testing.
## 1.1    Problem Statement
AspectDescription
ProblemLet’s be honest - finding property in Pakistan is a real headache.
You’re juggling multiple websites like Zameen.com, Graana, OLX,
and even random Facebook groups, hoping to find something de-
cent.  The worst part?  Half the listings you see are already sold or
rented out, but they’re still sitting there online. And if you’re more
comfortable in Urdu or Roman Urdu, tough luck - most platforms
are English-only.
AffectsThink about it from both sides. Property seekers are wasting hours,
sometimes  days,  calling  agents  about  properties  that  aren’t  even
available  anymore.   Meanwhile,  agents  are  pulling  their  hair  out
answering the same basic questions over and over - "What’s the
price?"  "Is  it  still  available?"  -  instead  of  actually  working  with
serious buyers. Nobody has the real-time information they need.
## 1

## LIST OF TABLES
AspectDescription
ImpactThis mess is actually holding back our entire real estate sector. Peo-
ple spend weeks trying to find a simple flat or house.  Agents are
losing money because they’re stuck dealing with endless casual in-
quiries.  And a huge chunk of the population just can’t use these
platforms comfortably because of the language barrier.
## A Successful So-
lution Would Be
We need something that brings it all together - one smart platform
that pulls in live listings from all the major sites and actually un-
derstands what you’re asking for in plain language.  Whether you
speak English or prefer Roman Urdu, even if you just want to use
voice search, it should work for you. The system should keep track
of properties you like and tell you when prices change or if they get
sold. And it should make it dead simple to schedule meetings with
agents without all the back-and-forth.
Table 1.1: Detailing the Problem Statement
## 1.2    Scope
PropertyWalay is here to shake things up in Pakistan’s property market.   We’re fixing
the real problems people face every day. The platform connects directly to Zameen.com,
Graana.com, and Booking.com to give you access to everything that’s actually available
right now.  Our AI chatbot gets what you’re saying whether you type in English or Ro-
man Urdu - no more struggling with complicated search filters.  The chatbot uses some
pretty cool retrieval-augmented generation technology to learn what you like and suggest
properties that actually match what you’re looking for.  You can save properties you’re
interested in, and we’ll automatically ping you if the price drops, if there’s an update, or
if it gets sold.  We’re also analyzing what’s hot in the market so you can see which areas
are trending - super useful if you’re thinking about investing.  For people living abroad
or anyone who can’t physically visit properties, we generate video tours that show you
around and give you context about the location.   We’ve automated the whole meeting
scheduling thing between buyers and agents, so no more phone tag.  Agents can gener-
ate professional PowerPoint presentations instantly for their client meetings. The system
remembers everything you’ve searched for, so you can pick up right where you left off.
Voice search works if you prefer talking over typing. You can use it on your computer or
phone - whatever works for you.  We take your privacy seriously and use proper encryp-
tion to keep your data safe. And we’ve built this to scale as Pakistan’s real estate market
keeps growing.
## 2

## 1.3 Modules
## 1.3    Modules
1.3.1    Natural Language Understanding (NLU) Module
This is the brain that lets you talk to the chatbot like a normal person.  You can describe
what you’re looking for in everyday language, whether that’s English or Roman Urdu. No
need to mess around with those annoying filter dropdowns.
-  Process natural language queries in English and Roman Urdu
-  Extract key search parameters from conversational text
-  Support voice-to-text conversion for hands-free searching
1.3.2    AI-Powered Recommendation Engine
This module is what makes our recommendations actually useful. It uses retrieval-augmented
generation and machine learning to understand what you really want.  The more you use
it, the smarter it gets at finding properties you’ll actually like.
-  Generate personalized recommendations using RAG technology
-  Rank results based on user preferences and behavior
-  Refine recommendations based on user feedback
1.3.3    Real-Time Listings Integration Module
This solves that annoying problem where you call about a property and find out it was
sold two weeks ago. We’re constantly pulling fresh data from major Pakistani real estate
websites through APIs and web scraping. What you see is what’s actually available.
-  Fetch and synchronize listings from Zameen.com, Graana.com, and Booking.com
-  Update property data in real-time for availability and price changes
-  Standardize data formats across different source platforms
1.3.4    Property Tracking and Notification Module
Save  properties  you’re  interested  in  and  let  us  watch  them  for  you.   We’ll  notify  you
the moment something changes - price drops, new updates, or if it gets sold.  No more
checking the same listings ten times a day.
-  Allow users to save and bookmark properties of interest
-  Monitor saved properties for price changes
-  Send notifications when properties are marked as sold or unavailable
1.3.5    Investment Insights and Trends Module
If you’re thinking about investing, this module tells you what’s hot and what’s not.  We
analyze all the market data to show you which areas are getting attention and where prices
## 3

## LIST OF TABLES
are moving. It’s like having your own market research team.
-  Analyze listing activity patterns to identify trending neighborhoods
-  Generate heat maps showing property demand across different areas
-  Compare price trends across locations and property types
## 1.3.6    Meeting Automation Module
Tired of playing phone tag with agents? This module handles all the scheduling for you.
Just tell the chatbot when you want to meet, and we’ll coordinate with the agent, find a
time that works, and send reminders to both of you.
-  Enable users to request meetings with agents through the chatbot
-  Integrate with agent calendars to find available time slots
-  Send automated meeting confirmations and reminders to both parties
## 1.3.7    Automated Presentation Generation Module
For agents, this is a game-changer. Instead of spending hours putting together PowerPoint
presentations for clients, you can generate professional-looking presentations in seconds.
More time for actual selling, less time on busywork.
-  Generate PowerPoint presentations with property details on demand
-  Include property images, floor plans, and location maps
-  Format presentations with professional templates
1.3.8    Location-Based Video Generation Module
Can’t visit a property in person?  We create video tours that show you what the property
looks  like,  where  it’s  located,  and  what’s  nearby.   This  is  especially  helpful  if  you’re
overseas or just can’t make the trip.
-  Generate short video tours using property images and data
-  Overlay location information and nearby amenities
-  Include map visualizations showing property location
1.3.9    User History and Profile Management Module
We remember everything - what you’ve searched for, which properties you’ve looked at,
what you seem to prefer.  This means the platform gets better at helping you the more
you use it. You can also go back and check out properties you looked at last week or last
month.
-  Store user search queries and browsing history across sessions
-  Maintain lists of viewed, saved, and contacted properties
-  Build user preference profiles based on interaction patterns
## 4

## 1.3 Modules
1.3.10    Multilingual and Voice Interface Module
Everyone should be able to use this platform comfortably.  Switch between English and
Roman Urdu whenever you want. Use voice search if you’re driving or just prefer talking.
We even handle it when you mix English and Urdu words in the same sentence - because
that’s how people actually talk.
-  Support seamless switching between English and Roman Urdu
-  Implement voice recognition for hands-free property searching
-  Handle code-mixing where users combine English and Urdu words
1.4    User Classes and Characteristics
User classDescription
## Property
## Seekers
These are everyday people like you and me looking for a place to live or buy.
They’re about 80% of who uses the platform - could be a young professional
hunting for an apartment, or a family trying to buy their first house.  A lot
of them are more comfortable with Roman Urdu. They’re usually searching
pretty actively, maybe 5-10 times a week.  The common thread?  They’re
short on time, frustrated with seeing properties that are already gone, and
just want straight, honest, up-to-date information.
RealEstate
## Agents
These are the licensed dealers who list properties and help close deals. We’re
talking about 2,000-3,000 active agents across Pakistan’s major cities, and
they’re working long days - easily 6-8 hours managing listings and answer-
ing calls.  Their biggest headache?  Endless calls from people who are just
casually browsing, not serious buyers.  What they really need are features
that help them spot who’s actually ready to buy, schedule meetings without
all the back-and-forth, and whip up professional presentations quickly.
Investors and
## Developers
These folks are looking at properties as business opportunities, not homes.
They make up about 15% of our users.  Usually pretty well-educated with
solid financial backgrounds, they want hard data on market trends and up-
and-coming neighborhoods.  They’re not in a rush - checking in maybe 2-3
times  a  week  to  do  their  research.   They  care  way  more  about  ROI  and
investment potential than whether the kitchen is nice.  They expect serious
analytics and professional market reports.
## 5

## LIST OF TABLES
User classDescription
## Overseas
## Pakistanis
Pakistanis living abroad who want to buy or rent back home - they’re about
20% of property seekers.  The big challenge for them is being thousands of
miles away and not being able to just go see a property. They really depend
on video tours, detailed descriptions, and anything that gives them a virtual
view.  Trust is huge for them since they can’t easily verify things in person.
They’re usually logging in during their evening hours, which might be our
nighttime.
Table 1.2: User Classes and Characteristics
## 6

## Chapter 2
## Project Requirements
In the rapidly evolving landscape of Pakistan’s real estate market, PropertyWalay emerges
as a transformative AI-powered chatbot system designed to revolutionize property search-
ing through intelligent automation and multilingual support.  This chapter introduces the
foundational elements that guide the structure and functionality of PropertyWalay in a
detailed  yet comprehensive  manner.   The use  of Use  Case  Diagrams,  Event  Response
Tables, and clear definitions of Functional Requirements (FRs) and Non-Functional Re-
quirements (NFRs) ensures that all stakeholders—from property seekers and real estate
agents to developers and platform administrators—have a thorough understanding of the
system’s capabilities and expectations.
The intelligent design of PropertyWalay allows for a meticulous integration of artificial in-
telligence, natural language understanding, and real-time data aggregation into a seamless
property search experience.  By addressing the fragmented nature of existing platforms
and bridging the communication gap through Roman Urdu support, PropertyWalay trans-
forms how Pakistanis discover and interact with property listings.  Use Case Diagrams
provide a visual representation of the system’s interactions with different stakeholders,
facilitating an intuitive understanding of various functionalities and user scenarios. Event
Response Tables outline the specific actions the system will undertake in response to dif-
ferent events, ensuring predictable, efficient, and user-centric operation.
Together, these elements form a robust framework that supports the detailed documen-
tation and specification needed to develop a system that not only meets but exceeds the
demands of Pakistan’s modern real estate sector. PropertyWalay’s requirements are struc-
tured to deliver personalized recommendations, automated tracking, investment insights,
and seamless agent coordination—all within a conversational interface that feels natural
to Pakistani users.
## 7

## 2. Project Requirements
2.1    Use-case/Event Response Table
For this project, we utilized a combination of a use case diagram and an event response
table as our primary requirement gathering techniques.   This section elaborates on the
methods selected to comprehensively capture and define PropertyWalay’s requirements,
ensuring a clear understanding of user interactions and system responses.  These tech-
niques  facilitated  a  structured  approach  to  identifying  and  documenting  the  necessary
functionalities and behaviors of the AI-powered real estate chatbot system.
The use case diagram provides a concise overview of PropertyWalay’s capabilities, help-
ing stakeholders understand its core offerings and user interactions by visually capturing
the platform’s primary interactions with pertinent roles associated with the system—including
Property Seekers, Real Estate Agents, Platform Administrators, and external service providers.
Figure 2.1: Use case diagram for PropertyWalay
The following event response table provides an overview of the designed user interactions
with  PropertyWalay’s  core  modules—including  Natural  Language  Understanding,  AI-
Powered Recommendation Engine,  Real-Time Listings Integration,  Property Tracking,
## 8

2.1 Use-case/Event Response Table
Investment Insights, Meeting Automation, and Content Generation—focusing exclusively
on user actions against the system. For each user action, the table describes the pre-state,
immediate system response and the resulting post-state of the system.
User ActionPre-Event StateSystem ResponsePost-Event State
## Property Seeker
chats with assistant
User logged in,
chatbot interface
displayed
System processes
natural language
query using NLU,
extracts search pa-
rameters
Property recommen-
dations displayed
based on query
Property Seeker per-
forms voice search
User on chatbot in-
terface, microphone
access granted
System converts
speech to text, pro-
cesses query, fetches
matching listings
Search results dis-
played with relevant
properties
## Property Seeker
browses property
listing
Search results dis-
played on screen
System retrieves
detailed property
information includ-
ing images, price,
location
Property details
page loaded with
complete informa-
tion
## Property Seeker
manages saved
properties
User logged in,
viewing property
details
System adds prop-
erty to saved list,
activates tracking
Property saved, user
receives confirma-
tion message
## Property Seeker
views investment
trends
User logged in, on
dashboard
System analyzes
market data, gener-
ates heat maps and
trend charts
Investment insights
displayed with
trending areas high-
lighted
## Property Seeker
compares properties
User has viewed
multiple properties
System retrieves
saved properties,
creates comparison
table
Side-by-side com-
parison displayed
with key metrics
## Property Seeker
manages search
history
User logged in, on
profile page
System retrieves
past searches and
viewed properties
from database
Search history dis-
played chronolog-
ically with quick
access
## Property Seeker
schedules agent
meeting
Viewing property
details, agent info
available
System checks
agent availability,
presents time slots
Meeting scheduled,
confirmation sent to
both parties
## 9

## 2. Project Requirements
User ActionPre-Event StateSystem ResponsePost-Event State
## Property Seeker
generates PPT pre-
sentation
Property details
page loaded
System compiles
property data, im-
ages, location maps
into PowerPoint
PPT generated and
download link pro-
vided
## Property Seeker
generates property
video
Viewing property
details page
System creates
video from images,
adds location over-
lay and narration
Video generated,
preview displayed
with download op-
tion
## Real Estate Agent
manages property
listing
Agent logged in, on
dashboard
System displays
agent’s active list-
ings with edit op-
tions
Listings displayed
with management
controls
## Real Estate Agent
responds to meeting
request
Meeting request
notification received
System displays
meeting details and
available time slots
Agent confirms
meeting, notifica-
tion sent to property
seeker
## Real Estate Agent
generates automated
notifications
New inquiry re-
ceived for listed
property
System creates noti-
fication with inquiry
details
Agent receives real-
time notification via
email/SMS
System (Property-
Walay) tracks prop-
erty updates
Property saved by
user, listings inte-
gration active
System moni-
tors property on
source websites for
changes
User notified when
price changes or
property sold
System (Property-
Walay) normalizes
data
New listings fetched
from multiple
sources
System standardizes
format, removes
duplicates, validates
data
Clean, normal-
ized data stored in
database
System (Property-
Walay) generates
personalized recom-
mendations
User logged in, suf-
ficient search his-
tory available
System applies
RAG technology,
analyzes prefer-
ences
Personalized prop-
erty recommenda-
tions generated
## Authorization Ser-
vice provides au-
thentication
User attempts to
login
Service verifies
credentials against
database
User authenticated
and session token
generated
Property listing
websites provide
property data
System requests
property listings via
## API
External websites
return property data
in JSON/XML for-
mat
Fresh property data
received and pro-
cessed
## 10

## 2.2 Functional Requirements
User ActionPre-Event StateSystem ResponsePost-Event State
SMS/Email Service
sends notifications
System triggers no-
tification for price
change
Service formats
message and sends
via email/SMS
User receives notifi-
cation on registered
contact
Table 2.1: Use-case/Event Response Table
## 2.2    Functional Requirements
This section describes the functional requirements of PropertyWalay organized by mod-
ules.  Each module contains specific functional requirements that define system capabili-
ties and expected behaviors.
2.2.1    Natural Language Understanding (NLU) Module
Following are the requirements for the Natural Language Understanding module:
-  The system shall accept user queries in English and Roman Urdu without requiring
language selection
-  The system shall extract property search parameters (location, price range, property
type, size) from natural language text
-  The system shall handle ambiguous queries by asking clarifying questions
-  The system shall support voice-to-text conversion for hands-free property searching
-  The system shall maintain conversation context across multiple query exchanges
-  The system shall handle code-mixing where users combine English and Urdu words
in queries
2.2.2    AI-Powered Recommendation Engine
Following are the requirements for the AI-Powered Recommendation module:
-  The system shall generate personalized property recommendations using RAG tech-
nology
-  The system shall rank search results based on user preferences, search history, and
behavioral patterns
-  The system shall apply collaborative filtering to suggest properties similar users
found relevant
-  The system shall refine recommendations based on user feedback (likes, dislikes,
saves)
-  The system shall provide explanations for why specific properties are recommended
-  The system shall update recommendation models based on user interactions
## 11

## 2. Project Requirements
2.2.3    Real-Time Listings Integration Module
Following are the requirements for the Real-Time Listings Integration module:
-  The system shall fetch property listings from Zameen.com, Graana.com, and Book-
ing.com
-  The system shall synchronize property data in real-time with update frequency of
maximum 1 hour
-  The system shall standardize data formats across different source platforms
-  The system shall validate scraped data for accuracy and completeness
-  The system shall handle API rate limits and implement efficient caching strategies
-  The system shall remove duplicate listings from different sources
2.2.4    Property Tracking and Notification Module
Following are the requirements for the Property Tracking and Notification module:
-  The system shall allow users to save and bookmark properties of interest
-  The system shall monitor saved properties for price changes automatically
-  The system shall send notifications when saved properties are marked as sold or
unavailable
-  The system shall track property view counts and engagement metrics over time
-  The system shall provide comparison views showing how saved properties have
changed
-  The system shall send notifications via email and SMS based on user preferences
2.2.5    Investment Insights and Trends Module
Following are the requirements for the Investment Insights and Trends module:
-  The system shall analyze listing activity patterns to identify trending neighborhoods
-  The  system  shall  generate  heat  maps  showing  property  demand  across  different
areas
-  The system shall compare price trends across locations and property types
-  The system shall provide investment scores based on historical data and current
trends
-  The system shall create market reports summarizing key insights for different cities
-  The system shall update trend analysis on a weekly basis
## 2.2.6    Meeting Automation Module
Following are the requirements for the Meeting Automation module:
## 12

## 2.2 Functional Requirements
-  The system shall enable users to request meetings with agents directly through the
chatbot
-  The system shall integrate with agent calendars to find available time slots
-  The system shall send automated meeting confirmations to both parties via email
and SMS
-  The  system  shall  provide  reminders  before  scheduled  meetings  (24  hours  and  1
hour before)
-  The system shall allow rescheduling and cancellation with automatic notifications
-  The system shall maintain meeting history for both users and agents
## 2.2.7    Automated Presentation Generation Module
Following are the requirements for the Automated Presentation Generation module:
-  The system shall generate PowerPoint presentations with property details on de-
mand
-  The system shall include property images, floor plans, and location maps in slides
-  The system shall format presentations with professional templates and consistent
styling
-  The system shall allow customization of presentation content and branding
-  The system shall enable direct download or email delivery of generated presenta-
tions
-  The system shall generate presentations within 30 seconds of request
2.2.8    Location-Based Video Generation Module
Following are the requirements for the Location-Based Video Generation module:
-  The system shall generate short video tours using property images and data
-  The system shall overlay location information and nearby amenities on video
-  The  system  shall  include  map  visualizations  showing  property  location  and  sur-
roundings
-  The system shall add voiceover narration describing key property features
-  The system shall enable sharing of generated videos via social media and messaging
apps
-  The system shall generate videos within 60 seconds of request
2.2.9    User History and Profile Management Module
Following are the requirements for the User History and Profile Management module:
-  The system shall store user search queries and browsing history across sessions
-  The system shall maintain lists of viewed, saved, and contacted properties
## 13

## 2. Project Requirements
-  The system shall build user preference profiles based on interaction patterns
-  The system shall allow users to review and manage their search history
-  The system shall enable quick access to previously shortlisted properties
-  The system shall allow users to delete search history and clear preferences
2.2.10    Multilingual and Voice Interface Module
Following are the requirements for the Multilingual and Voice Interface module:
-  The system shall support seamless switching between English and Roman Urdu
-  The system shall implement voice recognition for hands-free property searching
-  The system shall convert voice queries to text and process through NLU pipeline
-  The system shall provide text-to-speech responses for accessibility
-  The system shall handle code-mixing where users combine English and Urdu words
-  The  system  shall  support  voice  commands  for  common  actions  (save,  compare,
contact agent)
2.3    Non-Functional Requirements
This  section  specifies  non-functional  requirements  that  define  quality  attributes  of  the
PropertyWalay system. These requirements are specific, quantitative, and verifiable.
## 2.3.1    Performance
-  The system shall provide chatbot responses within 2-3 seconds for 95% of user
queries
-  The system shall load property search results within 3 seconds of query submission
-  The system shall generate property recommendations within 4 seconds using RAG
technology
-  The system shall support at least 1000 concurrent users without performance degra-
dation
-  The system shall synchronize property listings from external sources within 1 hour
intervals
-  The system shall process voice-to-text conversion within 2 seconds of audio input
## 2.3.2    Reliability
-  The system shall maintain 99% uptime for listing updates and user interactions
-  The system shall have a Mean Time Between Failures (MTBF) of at least 720 hours
(30 days)
## 14

2.3 Non-Functional Requirements
-  The system shall automatically recover from failures within 5 minutes
-  The system shall maintain data consistency across all integrated property listing
sources
-  The system shall implement automatic backup of user data every 24 hours
-  The system shall log all errors and exceptions for debugging and monitoring
## 2.3.3    Usability
-  The system shall allow property seekers to find and save properties within 3 inter-
actions
-  The system shall provide intuitive chat interface requiring no training for basic op-
erations
-  The system shall display error messages in user-friendly language (English/Roman
## Urdu)
-  The system shall allow users to retrieve previously viewed properties with a single
click
-  The system shall provide contextual help and suggestions during property search
-  The system shall be accessible on mobile devices with responsive design
## 2.3.4    Security
-  The system shall encrypt all user data at rest using AES-256 encryption
-  The  system  shall  use  HTTPS/TLS  for  all  data  transmission  between  client  and
server
-  The system shall implement user authentication using secure token-based mecha-
nisms
-  The system shall hash and salt all user passwords using bcrypt algorithm
-  The system shall implement rate limiting to prevent brute force attacks (5 failed
attempts)
-  The system shall log all authentication attempts and security events
-  The system shall comply with Pakistan’s data protection regulations
-  The system shall implement role-based access control for different user types
## 2.3.5    Scalability
-  The system shall be designed to handle a 300% increase in user load
-  The system shall support horizontal scaling by adding additional server instances
-  The system shall handle at least 10,000 property listings without performance degra-
dation
-  The system shall support expansion to additional property listing sources
## 15

## 2. Project Requirements
## 2.3.6    Compatibility
-  The system shall be compatible with Chrome, Firefox, Safari, and Edge browsers
-  The system shall support Android (version 8.0+) and iOS (version 12.0+) devices
-  The system shall function properly on screen sizes ranging from 320px to 2560px
width
-  The system shall integrate with third-party APIs from Zameen.com, Graana.com,
## Booking.com
## 2.3.7    Maintainability
-  The system shall be modular to allow independent updates of individual modules
-  The system code shall follow industry-standard coding conventions and documen-
tation
-  The system shall provide comprehensive API documentation for developers
-  The system shall implement automated testing with at least 80% code coverage
## 16

## Chapter 3
## System Overview
PropertyWalay  is  an  innovative  AI-powered  chatbot  system  designed  to  revolutionize
property searching in Pakistan through the integration of natural language understand-
ing, real-time data aggregation, and intelligent recommendation technologies. Key mod-
ules include the Natural Language Understanding (NLU) module, which transforms user
queries in English and Roman Urdu into structured search parameters; the AI-Powered
Recommendation Engine, which personalizes property suggestions using RAG technol-
ogy;  the Real-Time Listings Integration module,  which aggregates data from multiple
platforms;  and  the  Property  Tracking  and  Notification  system,  which  monitors  saved
properties for changes.  Additional features include automated meeting scheduling with
agents, PPT generation for property presentations, and location-based video generation.
Developed using a procedural programming approach with a four-tier architecture, Prop-
ertyWalay efficiently addresses the challenges of fragmented property search, language
barriers, and outdated listings in Pakistan’s real estate market.  This system not only en-
hances property search efficiency but also supports users in making informed investment
decisions in a dynamic and competitive real estate landscape.
## 3.1    Architectural Design
The architectural design of PropertyWalay follows a four-tier architecture pattern, provid-
ing a clear separation of concerns and enabling scalability, maintainability, and efficient
resource management. Each tier is responsible for specific functionalities and communi-
cates with adjacent layers through well-defined interfaces. This modular structure allows
independent development, testing, and deployment of components while ensuring seam-
less integration across the entire system.
## 17

## 3. System Overview
3.1.1    Box and Line Diagram
The box and line diagram provides a simplified, high-level view of PropertyWalay’s major
subsystems and their interconnections. This initial representation illustrates how different
components collaborate to deliver the complete functionality of the property search and
recommendation system.
Figure 3.1: Box and Line Diagram of PropertyWalay System
As shown in the diagram, the system is organized around five core components:
User Interface: Serves as the entry point for all user interactions, providing a conversa-
tional chatbot interface where property seekers and agents can interact with the system
using natural language queries in English or Roman Urdu.
NLU Module:  Processes and interprets natural language queries from users, extracting
key parameters such as location, property type, price range, and size. This module bridges
the gap between human language and system operations.
AI Recommendation: Implements Retrieval-Augmented Generation (RAG) technology
to provide personalized property recommendations based on user preferences, search his-
tory, and behavioral patterns.  This intelligent engine continuously learns and adapts to
user needs.
Listings Integration: Aggregates real-time property data from multiple external sources
including Zameen.com, Graana.com, and Booking.com.  This module ensures data stan-
dardization, removes duplicates, and maintains up-to-date property information.
Automation:  Handles  automated  functionalities  including  property  tracking  for  price
changes, meeting scheduling with agents, PPT generation, and video creation. This mod-
ule reduces manual effort and provides value-added services.
Backend  &  Database:  Manages  data  persistence,  user  profiles,  search  history,  saved
properties, and system configurations. This foundational layer ensures data integrity and
supports all other modules with reliable data storage and retrieval capabilities.
## 18

## 3.1 Architectural Design
The  arrows  in  the  diagram  represent  data  flow  and  communication  pathways  between
components.  The NLU Module acts as the central processing unit, receiving input from
the User Interface and coordinating with other modules. Both the Listings Integration and
Automation modules interact with the Backend & Database for data operations, while the
AI Recommendation module receives processed queries from NLU and retrieves relevant
data to generate personalized suggestions.
3.1.2    Four-Tier Architecture
PropertyWalay’s architecture is structured into four distinct tiers: Presentation Layer, Ap-
plication Layer, Integration Layer, and Data Layer. This layered approach provides mod-
ularity, scalability, and clear separation of responsibilities across the system.
Figure 3.2: Four-Tier Architecture of PropertyWalay System
## 19

## 3. System Overview
## 3.1.2.1    Presentation Layer
The Presentation Layer serves as the user-facing interface of PropertyWalay, providing an
intuitive and accessible chatbot-based user interface. This layer is responsible for:
-  User Interaction:  Facilitating user input through text and voice-based queries in
English and Roman Urdu
-  Chatbot Interface: Providing a conversational interface that mimics natural human
interaction for property searching
-  Response  Rendering:  Displaying  property  listings,  recommendations,  compar-
isons, investment insights, and generated content (PPTs, videos)
-  Session Management: Maintaining user sessions and conversation context across
multiple interactions
The Presentation Layer is implemented using ReactJS for web interfaces and is designed
to be responsive across desktop and mobile devices. It communicates bidirectionally with
the Application Layer to send user requests and receive system responses.
## 3.1.2.2    Application Layer
The Application Layer contains the core business logic and intelligent processing capa-
bilities of PropertyWalay. This tier comprises three primary modules:
NLU Processor: Receives raw natural language queries from the Presentation Layer and
performs:
-  Natural language parsing and intent recognition
-  Entity extraction (location, price, property type, size)
-  Language detection and processing (English/Roman Urdu)
-  Query contextualization based on conversation history
AI Recommendation & Core Logic: Implements the intelligent recommendation engine
using RAG technology:
-  Retrieval of relevant property listings from the database
-  Application of user preference models and behavioral patterns
-  Ranking and filtering of properties based on multiple criteria
## 20

## 3.1 Architectural Design
-  Generation of personalized recommendations and explanations
-  Investment trend analysis and insights generation
Automation Modules: Manages automated features that enhance user experience:
-  PPT Generation: Compiles property data, images, and location maps into profes-
sional PowerPoint presentations
-  Meeting Scheduling:  Coordinates meetings between property seekers and agents
by checking availability and sending confirmations
-  Property Tracking:  Monitors saved properties for price changes and availability
status, triggering notifications when updates occur
-  Video Generation: Creates location-based property videos with overlays and nar-
ration
The Application Layer orchestrates the flow of information between user requests and
data  operations,  implementing  the  core  intelligence  and  automation  that  distinguishes
PropertyWalay from traditional property search platforms.
## 3.1.2.3    Integration Layer
The Integration Layer acts as a bridge between the application logic and external data
sources, handling real-time data synchronization and API communication:
Integration API — Real-Time: This component is responsible for:
-  Connecting to external property listing platforms (Zameen.com, Graana.com, Book-
ing.com) via APIs or web scraping
-  Fetching real-time property data at regular intervals (maximum 1-hour refresh rate)
-  Data transformation and standardization across different source formats
-  Duplicate detection and removal across multiple sources
-  Error handling and retry mechanisms for failed API calls
-  Rate limiting compliance to respect external API constraints
This layer ensures that PropertyWalay always presents users with the most current prop-
erty information available, addressing one of the major pain points in Pakistan’s real estate
market—outdated listings.
## 21

## 3. System Overview
## 3.1.2.4    Data Layer
The Data Layer provides persistent storage and data management capabilities for the en-
tire system:
Database: The database component manages:
-  User Data: User profiles, authentication credentials, preferences, and roles (prop-
erty seekers, agents, administrators)
-  Property Listings: Aggregated and standardized property data from multiple sources
with timestamps
-  Search History: Records of user queries, viewed properties, and search patterns
-  Saved Properties: User-saved property lists with tracking status
-  Meeting  Records:  Scheduled  meetings  between  seekers  and  agents  with  status
updates
-  System Logs: Transaction logs, error logs, and audit trails
-  Cache Data: Frequently accessed data for improved performance
PropertyWalay uses a combination of PostgreSQL for structured relational data (users,
meetings, transactions) and MongoDB for semi-structured data (property listings, search
history, user preferences), providing flexibility and optimal performance for different data
types.
## 3.1.3    Architecture Benefits
The four-tier architecture of PropertyWalay offers several key advantages:
-  Modularity: Each tier can be developed, tested, and deployed independently
-  Scalability: Individual tiers can be scaled horizontally based on load (e.g., adding
more Integration Layer instances during peak scraping times)
-  Maintainability: Clear separation of concerns makes the system easier to maintain
and update
-  Security:   Layered  architecture  enables  implementation  of  security  measures  at
each tier
-  Flexibility:  New features or external integrations can be added without affecting
other layers
## 22

## 3.1 Architectural Design
-  Performance: Each layer can be optimized independently for its specific responsi-
bilities
Overall, the system follows a procedural approach within a four-tier architecture, where
different services are responsible for specific tasks or functionalities. These services work
together to provide a modular, scalable, and flexible system architecture tailored to the
unique requirements of Pakistan’s real estate market.
## 23

## 3. System Overview
## 3.2    Design Models
## 3.2.1    Activity Diagram
Figure 3.3: Activity Diagram of PropertyWalay System
## 24

## 3.2 Design Models
The activity diagram of PropertyWalay visually represents the dynamic flow of opera-
tions, capturing the sequence of activities and decision points within the platform’s mod-
ules across pertinent user roles. This activity diagram illustrates the complete user journey
from entering a property search query through to potentially scheduling a meeting with a
real estate agent.
The diagram is organized into four swim lanes representing the major actors and system
components: User, Property Walay System, DB (Database), and Agent.
## 3.2.1.1    Property Search Flow
The activity flow begins when the user enters a property search query through the chat-
bot interface.  The system processes this query using the NLU module to extract search
parameters such as location, property type, price range, and size.  The processed query
is then sent to the database which queries the aggregated property listings from multiple
sources.
After  retrieving  relevant  properties  from  the  database,  the  system  applies  AI-powered
recommendations using RAG technology.   This step analyzes user preferences,  search
history, and behavioral patterns to personalize the results.  The recommendation engine
ranks and filters properties based on multiple criteria before displaying them to the user.
3.2.1.2    Property Selection and PPT Generation
Once the user views the property recommendations, they can select a specific property for
more detailed information. At this point, the user is presented with a decision: whether to
generate a PowerPoint presentation for the selected property.
If the user chooses yes for PPT generation, the system collects comprehensive property
data including images, floor plans, location maps, price details, and amenities.  The sys-
tem then generates a professionally formatted PowerPoint presentation and provides a
download link to the user.  This feature is particularly useful for users who want to share
property details with family members or for agents preparing for client meetings.
If the user chooses no, the system proceeds directly to the next decision point.
## 3.2.1.3    Meeting Scheduling Flow
After handling the PPT generation decision, the user is presented with another option:
whether to schedule a meeting with the property agent. This decision point enables direct
interaction between property seekers and real estate agents.
## 25

## 3. System Overview
If the user selects no for scheduling a meeting, the activity flow terminates, and the user
can continue browsing other properties or exit the system.
If the user selects yes, the following sequence occurs:
-  The user formally requests a meeting through the interface
-  The system sends a meeting request to the designated agent
-  The agent receives a meeting request notification
-  The agent must decide whether to accept the meeting invitation
## 3.2.1.4    Agent Response Handling
The agent’s response to the meeting invitation creates two possible paths:
Meeting Declined: If the agent chooses no, the system notifies the user that the meeting
has been declined.  The user receives this notification and the process terminates.  This
ensures transparency and allows the user to either contact a different agent or reconsider
their options.
Meeting Accepted:  If the agent chooses yes to accept the meeting invitation, a parallel
process is triggered where the system performs two actions simultaneously:
-  Notifies the user that the meeting has been confirmed
-  Schedules the meeting with date, time, and location details
Both notifications are sent concurrently to ensure both parties are immediately informed
of the confirmed meeting. After these notifications are delivered, the activity flow reaches
its final termination point.
## 3.2.1.5    Key Decision Points
The activity diagram highlights three critical decision points in the user journey:
-  Generate PPT? — Determines whether the user wants a downloadable presenta-
tion
-  Schedule Meeting? — Determines whether the user wants direct agent interaction
-  Accept Invitation?  — Determines whether the agent is available and willing to
meet
These decision points provide flexibility and user control throughout the property search
and engagement process.
## 26

## 3.2 Design Models
## 3.2.1.6    System Benefits Illustrated
The activity diagram effectively demonstrates several key features of PropertyWalay:
-  Automated Intelligence: The NLU processing and AI recommendation steps show
how the system intelligently interprets and responds to user needs
-  Content Generation: The PPT generation flow illustrates value-added automation
features
-  Agent Coordination:  The meeting scheduling sequence demonstrates how Prop-
ertyWalay facilitates communication between seekers and agents
-  User Empowerment: Multiple decision points give users control over their expe-
rience
-  Real-time Integration: Database queries reflect the system’s access to aggregated,
up-to-date property listings
This  comprehensive  activity  flow  ensures  that  PropertyWalay  provides  a  seamless,  in-
telligent, and user-centric property search experience from initial query to potential agent
meeting, addressing the fragmented nature of traditional property search processes in Pak-
istan.
## 3.2.2    Data Flow Diagram
Data Flow Diagrams (DFDs) provide a visual representation of how data moves through
the PropertyWalay system, illustrating the flow of information between processes, data
stores, and external entities.  The hierarchical approach—from Context Diagram (Level
0) to increasingly detailed levels—enables stakeholders to understand both the high-level
system architecture and the intricate operational details of each module.
3.2.2.1    DFD Level 0 - Context Diagram
Level 0 Data Flow Diagram provides a top-level, simplified representation of Property-
Walay’s data flow. It offers a broad overview of the system’s architecture, illustrating how
data  moves  between  the  system  and  end  users  (Property  Seekers,  Real  Estate  Agents,
and External Property Listing Platforms), setting the stage for more detailed analysis in
lower-level DFDs.
## 27

## 3. System Overview
Figure 3.4: Context Diagram of the PropertyWalay System
The Context Diagram shows PropertyWalay as a single process (circle in the center) in-
teracting with three primary external entities:
-  Property Seeker: Sends search queries, voice input, investment queries, and meet-
ing  requests  to  the  system.   Receives  property  results,  recommendations,  price
alerts, notifications, trending investment pages, and generated content (PPTs/Videos).
-  Property Dealer/Agent: Receives meeting requests and property information from
the system.   Sends meeting confirmations and property details back to Property-
## Walay.
-  External Property Platforms (Zameen.com, Graana.com, Booking.com, Lamudi.com):
Provide property listings to PropertyWalay through API calls and web scraping.
This high-level view establishes the system boundary and identifies the major information
flows without detailing internal processes.
3.2.2.2    DFD Level 1
Level 1 Data Flow Diagram delves deeper into the details of PropertyWalay,  breaking
down the system into more specific subprocesses. Data stores, external entities, and data
flows are further detailed at this level,  providing a more comprehensive understanding
of how data is processed and exchanged at a more specific operational level.  The Level
1  DFD  acts  as  an  intermediary  step  between  the  high-level  abstraction  of  the  Level  0
diagram and the more intricate, lower-level DFDs that follow, offering a balanced level of
## 28

## 3.2 Design Models
detail for system analysis and design.
Figure 3.5: DFD Level 1 Diagram of the PropertyWalay System
The Level 1 DFD decomposes PropertyWalay into eight major processes:
Process 1.0 - NLU Processing:
-  Input: Raw queries from User/Buyer/Investor
-  Processing: Natural language understanding, entity extraction, language detection
## 29

## 3. System Overview
-  Output: Resolved query with structured parameters
-  Data Store Interaction:  Saves search to D1:  User History, retrieves user history
for context
## Process 2.0 - Property Search & Recommendation:
-  Input: Resolved query from Process 1.0
-  Processing:  RAG-based recommendation engine, collaborative filtering, property
ranking
-  Output: Personalized property results to user
-  Data Store Interaction: Fetches property data from D2: Property DB
## Process 3.0 - Real Time Integration:
-  Input: Fetch requests from Process 2.0, API calls to external platforms
-  Processing: Web scraping, data normalization, duplicate removal
-  Output: Live listings to Process 2.0
-  Data Store Interaction: Stores/retrieves property info from D2: Property DB
## •  External Entity: Zameen.com, Graana.com, Booking.com, Lamudi.com
## Process 4.0 - Saved Property Management:
-  Input: Save property requests from user
-  Processing: Store saved properties, track changes
-  Output: Property update alerts to Process 8.0
-  Data Store Interaction: Stores/retrieves from D3: Saved Properties
## Process 5.0 - Investment Analytics:
-  Input: Investment queries from user, price changes from Process 4.0
-  Processing: Trend analysis, heat map generation, market insights
-  Output: Investment insights to user
-  Data Store Interaction: Stores/retrieves analytics from D4: Analytics Data
## Process 6.0 - Content Generation:
-  Input: PPT/Video requests from user, property info from D2
-  Processing: PowerPoint assembly, video compilation with maps and narration
-  Output: Generated PPT/Video content to user
-  Data Store Interaction: Retrieves property data from D2: Property DB
## Process 7.0 - Meeting Scheduler:
-  Input: Meeting requests from user, confirmations from Property Agent
-  Processing: Schedule coordination, calendar integration, reminder generation
-  Output: Notifications to user via Process 8.0, meeting requests to agent
## 30

## 3.2 Design Models
-  Data Store Interaction: Stores/retrieves from D5: Meeting Schedule
## Process 8.0 - Notification System:
-  Input: Alerts from Process 4.0, notifications from Process 7.0
-  Processing: Notification formatting, delivery channel selection (email/SMS)
-  Output: Price alerts, meeting confirmations, property updates to user
## Data Stores:
-  D1: User History - Stores search queries, viewed properties, user preferences
-  D2: Property DB - Central repository for aggregated property listings
-  D3: Saved Properties - User-bookmarked properties with tracking status
-  D4: Analytics Data - Price trends, view counts, market insights
-  D5: Meeting Schedule - Agent meeting records and calendar data
3.2.2.3    DFD Level 2 - AI-Powered Property Recommendation
This Level 2 diagram provides a detailed breakdown of PropertyWalay’s "Property Search
& Recommendation" (Process 2.0) operations, offering a granular perspective on the flow
of data and functionalities. The recommendation process is further dissected into "Query
Parser", "Retrieve User Profile", "Filter Properties", "RAG-based Recommend Engine",
"Format Response", and "Update Search Log" which are the key components for the AI
## Recommendation Module.
## 31

## 3. System Overview
Figure 3.6: DFD Level 2 Diagram of AI-Powered Property Recommendation
## Process 2.1 - Query Parser:
-  Input: Resolved query from p1 NLU Processing
-  Processing:  Extract structured parameters (location,  price,  beds,  baths,  property
type)
-  Output: Query parameters to Process 2.2 and D6: Query Parameters
## Process 2.2 - Retrieve User Profile:
-  Input: User identification from Process 2.1
-  Processing: Fetch search history, saved properties, behavioral patterns
-  Output: User profile data to Process 2.3
## 32

## 3.2 Design Models
-  Data Store Interaction: Retrieves from D1: User History
## Process 2.3 - Filter Properties:
-  Input: Query parameters from Process 2.1, user profile from Process 2.2
-  Processing: Apply filters based on price, location, size, amenities
-  Output: Filtered property set to Process 2.4
-  Data Store Interaction: Retrieves from D2: Property Database and p3 Real Time
## Data
Process 2.4 - RAG-based Recommend Engine:
-  Input: Filtered properties from Process 2.3
-  Processing:  Retrieval-Augmented Generation, collaborative filtering, ranking al-
gorithm
-  Output: Ranked recommendations to Process 2.5
-  Data Store Interaction: Retrieves from D7: AI Model Data
## Process 2.5 - Format Response:
-  Input: Ranked recommendations from Process 2.4
-  Processing: Format results for display, prepare explanations
-  Output: Formatted property listings to User and to p6 Content Generation
## Process 2.6 - Update Search Log:
-  Input: Query parameters and results from Process 2.5
-  Processing: Log search activity, update user profile
## •  Data Store Interaction: Updates D1: User History
3.2.2.4    DFD Level 2 - Content Generation (PPT & Video)
This Level 2 diagram provides a detailed breakdown of PropertyWalay’s "Content Gen-
eration" (Process 6.0) operations, offering a granular perspective on the flow of data and
functionalities. The content generation is further dissected into "Validate Request", "Fetch
Property Details",  "Retrieve Images",  "Generate Map & Location",  "Select Template",
"Compose PPT Slides", "Generate Video Tour", "Quality Check & Export", and "Store
Content History" which are the key components for the Automated Presentation Genera-
tion and Video Generation modules.
## 33

## 3. System Overview
Figure 3.7: DFD Level 2 Diagram of Content Generation (PPT & Video)
## Process 6.1 - Validate Request:
-  Input: PPT/Video request from TO User
-  Processing: Verify property ID, check user permissions, validate content type
## 34

## 3.2 Design Models
-  Output: Valid request confirmation to Process 6.2
## Process 6.2 - Fetch Property Details:
-  Input: Validated property ID from Process 6.1
-  Processing: Retrieve comprehensive property information
-  Output: Property data to Process 6.3, Image URLs to Process 6.3
-  Data Store Interaction: Retrieves from D2: Property Database
## •  External Input: From P2.0 Property Data
## Process 6.3 - Retrieve Images:
-  Input: Image URLs from Process 6.2
-  Processing: Fetch images from storage, optimize for presentation
-  Output: Images to Process 6.4 and Process 6.6, Location data to Process 6.4
-  Data Store Interaction: Retrieves from D8: Media Assets
## Process 6.4 - Generate Map & Location:
-  Input: Location data from Process 6.3, Images from Process 6.3
-  Processing:  Create location maps, identify nearby amenities, generate map over-
lays
-  Output: Map to Process 6.5 and Process 6.6, Content type decision to Process 6.5
-  Data Store Interaction: Caches maps in D11: Map Cache
## Process 6.5 - Select Template:
-  Input: Content type from Process 6.4, Map from Process 6.4
-  Processing: Choose appropriate PPT template based on property type
-  Output: Template + Data to Process 6.6
-  Data Store Interaction: Retrieves from D9: PPT Templates
Process 6.6 - Compose PPT Slides:
-  Input:  Template + Data from Process 6.5,  Images from Process 6.4,  Map from
## Process 6.4
-  Processing: Assemble slides with property details, images, pricing, amenities
-  Output: Draft PPTx to Process 6.8, Location to Process 6.7
## Process 6.7 - Generate Video Tour:
-  Input: Location from Process 6.6, Meta data from Process 6.6
-  Processing: Compile images into video, add location overlays, generate voiceover
narration
-  Output: Video file to Process 6.8
## Process 6.8 - Quality Check & Export:
## 35

## 3. System Overview
-  Input: Draft PPTx from Process 6.6, Video file from Process 6.7
-  Processing: Validate formatting, check file integrity, compress for delivery
-  Output: Final PPTx/Video to TO User, Storing command to Process 6.9
## Process 6.9 - Store Content History:
-  Input: Storing command from Process 6.8
-  Processing: Log generation metadata, track user downloads
-  Data Store Interaction: Stores in D10: Generated Content
3.2.2.5    DFD Level 2 - Meeting Automation
This Level 2 diagram provides a detailed breakdown of PropertyWalay’s "Meeting Sched-
uler" (Process 7.0) operations,  offering a granular perspective on the flow of data and
functionalities. The meeting automation is further dissected into "Receive Request", "Val-
idate User & Property", "Check Agent Availability", "Find Available Time Slot", "Create
Meeting", "Notify Agent", "Send User Confirmation", "Generate Reminders", and "Up-
date Status" which are the key components for the Meeting Automation Module.
## 36

## 3.2 Design Models
Figure 3.8: DFD Level 2 Diagram of Meeting Automation
## 37

## 3. System Overview
## Process 7.1 - Receive Request:
-  Input: Meeting request from User
-  Processing: Parse request details, extract property and user information
-  Output: Request details to Process 7.2
## Process 7.2 - Validate User & Property:
-  Input: Request details from Process 7.1
-  Processing:  Verify user authentication,  check property exists,  validate agent as-
signment
-  Output: User data to Process 7.3, Agent ID to Process 7.3
-  Data Store Interaction: Checks D1: User History and D2: Property Database
## Process 7.3 - Check Agent Availability:
-  Input: Agent ID from Process 7.2
-  Processing: Query agent calendar, identify free time slots
-  Output: Schedule/Free Slot to Process 7.4, Agent ID to Process 7.4
-  Data Store Interaction: Retrieves from D12: Agent Schedule
## Process 7.4 - Find Available Time Slot:
-  Input: Schedule/Free Slot from Process 7.3, Agent ID from Process 7.3
-  Processing: Match user preferences with agent availability, propose time slots
-  Output: Available time to Process 7.5, Select slot confirmation to Process 7.5
## Process 7.5 - Create Meeting:
-  Input: Available time and Select slot from Process 7.4
-  Processing:  Generate meeting record, assign unique meeting ID, set meeting pa-
rameters
-  Output: Meeting info to Process 7.6 and Process 7.7, Confirmation details to Pro-
cess 7.7
-  Data Store Interaction: Stores in D5: Meeting Schedule
## Process 7.6 - Notify Agent:
-  Input: Meeting info from Process 7.5
-  Processing: Format notification with meeting details, send to agent
-  Output: Notification to Agent
## Process 7.7 - Send User Confirmation:
-  Input: Meeting info and Confirmation details from Process 7.5
-  Processing: Generate confirmation message with meeting details, date, time, loca-
tion
## 38

## 3.2 Design Models
-  Output:  Confirmation to TO User,  Meeting details to Process 7.8,  Schedule re-
minders command to Process 7.8
## Process 7.8 - Generate Reminders:
-  Input: Meeting details from Process 7.7, Schedule reminders command from Pro-
cess 7.7, Selected time
-  Processing: Create reminder schedule (24 hours before, 1 hour before), queue re-
minders
-  Output: Reminder to TO User, Reminder to Agent, Status update to Process 7.9
-  Data Store Interaction: Stores in D13: Notification Queue
## Process 7.9 - Update Status:
-  Input: Status update from Agent, Status update from Process 7.8
-  Processing: Track meeting status (scheduled, completed, cancelled, rescheduled)
## •  Data Store Interaction: Updates D5: Meeting Schedule
These detailed Level 2 DFDs provide comprehensive insights into the internal workings of
PropertyWalay’s major subsystems, demonstrating the intricate data transformations and
interactions  that  enable  intelligent  property  search,  automated  content  generation,  and
seamless agent coordination.  Each process is carefully designed to support the system’s
functional requirements while maintaining data integrity and optimal performance.
## 3.2.3    System-level Sequence Diagram
This section contains system sequence diagrams for the PropertyWalay project.  As the
system operates autonomously,  only the input and output are depicted.   The system is
treated as a black box, adhering to system sequence diagram rules.
## 39

## 3. System Overview
## 3.2.3.1    Process Natural Language Query
Figure  3.9:  System  Sequence  Diagram  for  Process  Natural  Language  Query  function
(NLU Module)
## 3.2.3.2    Search Properties
Figure 3.10:  System Sequence Diagram for Search Properties function (AI Recommen-
dation Module)
## 40

## 3.2 Design Models
## 3.2.3.3    View Property Details
Figure 3.11:  System Sequence Diagram for View Property Details function (Database
## Module)
## 3.2.3.4    Save Property
Figure 3.12: System Sequence Diagram for Save Property function (Database Module)
## 41

## 3. System Overview
## 3.2.3.5    Get Saved Properties
Figure  3.13:  System  Sequence  Diagram  for  Get  Saved  Properties  function  (Database
## Module)
3.2.3.6    Generate PPT
Figure 3.14: System Sequence Diagram for Generate PPT function (Automation Module)
## 42

## 3.2 Design Models
## 3.2.3.7    Generate Property Video
Figure 3.15: System Sequence Diagram for Generate Property Video function (Automa-
tion Module)
## 3.2.3.8    Request Agent Meeting
Figure 3.16: System Sequence Diagram for Request Agent Meeting function (Automation
## Module)
## 43

## 3. System Overview
## 3.2.3.9    Agent Accepts Meeting
Figure 3.17: System Sequence Diagram for Agent Accepts Meeting function (Automation
## Module)
## 3.2.3.10    Get Search History
Figure 3.18: System Sequence Diagram for Get Search History function (Database Mod-
ule)
## 44

## 3.2 Design Models
## 3.2.3.11    Compare Properties
Figure 3.19: System Sequence Diagram for Compare Properties function (AI Recommen-
dation Module)
## 3.2.3.12    Get Investment Insights
Figure 3.20: System Sequence Diagram for Get Investment Insights function (AI Recom-
mendation Module)
## 45

## 3. System Overview
## 3.2.3.13    Track Property Updates
Figure 3.21: System Sequence Diagram for Track Property Updates function (Automation
## Module)
3.2.3.14    Fetch Listings from External Source
Figure 3.22: System Sequence Diagram for Fetch Listings from External Source function
(Integration Module)
## 46

## 3.3 Data Design
## 3.3    Data Design
When it comes to representing intricate data structures like database schemas, sometimes
the most effective method is the simplest:  presenting it in its raw, textual form.  While
there are various visualization tools and methods available for database structures or flow
diagrams, a database schema’s detailed nature often means that the clearest way to under-
stand it is by viewing the actual text. This ensures that none of the schema’s nuances are
lost in translation.
The  PropertyWalay  database  schema  has  been  meticulously  designed  using  Supabase
(PostgreSQL) to capture essential property information,  user interactions,  and system
operations in a structured manner. The schema utilizes UUID-based primary keys ensur-
ing global uniqueness and facilitating data consistency across distributed operations. The
our_id attribute in the properties table, while serving as a unique identifier, is also piv-
otal for referencing properties in other tables, ensuring data consistency and facilitating
relational database operations. This interconnectedness is vital for maintaining a holistic
view of property listings, user preferences, and price tracking across the system.
## 3.3.1    Properties Table
The properties table serves as the central repository for all property listings aggregated
from external sources (Graana,  Lamudi,  and Zameen).   The our_id attribute uniquely
identifies each property within PropertyWalay, while source and source_id maintain
the original platform identifiers. The images field uses JSONB format for flexible storage
of property photos with metadata.  Geographic coordinates (latitude, longitude) en-
able location-based features, while temporal fields (created_at, updated_at, last_price_change_at)
support real-time synchronization and price tracking.
CREATE TABLE IF NOT EXISTS properties (
our_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
source TEXT NOT NULL CHECK (source IN (’graana’,’lamudi’,’zameen’)),
source_id TEXT NOT NULL,
source_human_id TEXT,
title TEXT,
prop_type TEXT,
prop_subtype TEXT,
area_size NUMERIC,
area_unit TEXT,
beds INT,
baths INT,
## 47

## 3. System Overview
area_name TEXT,
link TEXT,
images JSONB,
poc_name TEXT,
poc_number TEXT,
latitude NUMERIC,
longitude NUMERIC,
current_price NUMERIC,
currency TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
last_price_change_at TIMESTAMPTZ
## );
CREATE UNIQUE INDEX IF NOT EXISTS ux_properties_source_sourceid
ON properties (source, source_id);
CREATE INDEX IF NOT EXISTS idx_properties_updated_at
ON properties(updated_at DESC);
## 3.3.2    Property Price History Table
The property_price_history table implements comprehensive price tracking functionality,
enabling users to monitor price changes over time and identify investment opportunities.
Central to this table is the our_id foreign key, which links price records to specific prop-
erties, ensuring seamless integration and data consistency.  The changed_at timestamp
provides a chronological record of all price modifications, supporting the Investment In-
sights Module in generating trend analysis and market reports.
CREATE TABLE IF NOT EXISTS property_price_history (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
our_id UUID NOT NULL REFERENCES properties(our_id)
## ON DELETE CASCADE,
price NUMERIC NOT NULL,
currency TEXT,
changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
CREATE INDEX IF NOT EXISTS idx_price_history_our_id_changed_at
ON property_price_history(our_id, changed_at DESC);
## 48

## 3.3 Data Design
## 3.3.3    Property Last Updates Table
The  property_last_updates  table  serves  as  an  efficient  synchronization  mechanism  for
tracking when properties were last modified on external platforms.   This dedicated ta-
ble enables the Integration Layer to quickly identify which properties require re-scraping
without scanning the entire properties table, supporting the 1-hour maximum refresh rate
requirement.
CREATE TABLE IF NOT EXISTS property_last_updates (
our_id UUID PRIMARY KEY REFERENCES properties(our_id)
## ON DELETE CASCADE,
last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
## 3.3.4    Saved Properties Table
The saved_properties table implements a many-to-many relationship between users and
properties, enabling the property tracking and notification features.  The composite pri-
mary key on email and our_id prevents duplicate saves while maintaining referential
integrity. When a user saves a property, the Property Tracking Module automatically be-
gins monitoring it for price changes and availability status, triggering notifications when
updates occur.
CREATE TABLE IF NOT EXISTS saved_properties (
email TEXT NOT NULL,
our_id UUID NOT NULL REFERENCES properties(our_id)
## ON DELETE CASCADE,
saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
PRIMARY KEY (email, our_id)
## );
## 3.3.5    App Users Table
The app_users table maintains registered user profiles and serves as the authentication
foundation for PropertyWalay.  The email attribute, with its unique constraint, ensures
single account per email address and serves as the primary identifier for user interactions
across the system. This table is referenced by saved properties, search logs, reviews, and
notifications, providing a cohesive framework for tracking user behavior that feeds into
the AI Recommendation Engine.
## 49

## 3. System Overview
CREATE TABLE IF NOT EXISTS app_users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email TEXT UNIQUE NOT NULL,
full_name TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
3.3.6    Property Reviews and Comments Tables
The property_reviews and property_comments tables facilitate community engagement
and trust-building within the platform. The reviews table captures user ratings (1-5 scale
enforced by CHECK constraint) and feedback, while the comments table enables discus-
sions and inquiries.  Both tables reference properties through our_id with CASCADE
delete, ensuring referential integrity. These tables support transparency and reduce agent
burden by allowing users to share experiences and ask questions publicly.
CREATE TABLE IF NOT EXISTS property_reviews (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
our_id UUID NOT NULL REFERENCES properties(our_id)
## ON DELETE CASCADE,
reviewer_email TEXT NOT NULL,
rating INT CHECK (rating BETWEEN 1 AND 5),
comment TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
CREATE INDEX IF NOT EXISTS idx_property_reviews_our_id_created_at
ON property_reviews(our_id, created_at DESC);
CREATE TABLE IF NOT EXISTS property_comments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
our_id UUID NOT NULL REFERENCES properties(our_id)
## ON DELETE CASCADE,
commenter_email TEXT NOT NULL,
body TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
CREATE INDEX IF NOT EXISTS idx_property_comments_our_id_created_at
ON property_comments(our_id, created_at DESC);
## 50

## 3.3 Data Design
3.3.7    Search Logs and Property Views Tables
The search_logs and property_views tables are structured to facilitate analytics and AI-
powered recommendations within PropertyWalay.  The search_logs table captures user
queries and extracted filters in JSONB format, providing raw data for the NLU Module
and trend analysis. The property_views table tracks engagement metrics, recording every
property viewing event. Together, these tables bridge raw user interactions with actionable
insights, underpinning the system’s journey towards personalized recommendations and
investment insights.  The filters attribute in search_logs is particularly significant as
it  stores  structured  search  parameters  extracted  by  the  NLU  Module,  enabling  the  AI
Recommendation Engine to understand user preferences and refine suggestions.
CREATE TABLE IF NOT EXISTS search_logs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email TEXT,
query TEXT NOT NULL,
filters JSONB,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at
ON search_logs(created_at DESC);
CREATE TABLE IF NOT EXISTS property_views (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
our_id UUID NOT NULL REFERENCES properties(our_id)
## ON DELETE CASCADE,
viewer_email TEXT,
viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
CREATE INDEX IF NOT EXISTS idx_property_views_our_id_viewed_at
ON property_views(our_id, viewed_at DESC);
## 3.3.8    Price Alert Subscriptions Table
CREATE TABLE IF NOT EXISTS price_alert_subscriptions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email TEXT NOT NULL,
our_id UUID NOT NULL REFERENCES properties(our_id)
## 51

## 3. System Overview
## ON DELETE CASCADE,
threshold_price NUMERIC NOT NULL,
currency TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE (email, our_id)
## );
## 3.3.9    Notifications Table
The notifications table is designed to streamline the handling of system-generated alerts
and  their  delivery  to  users.   Within  this  table,  the title  and body  attributes  provide
human-readable content, while the meta field (JSONB format) stores structured data link-
ing  notifications  to  specific  properties,  actions,  or  events.   The is_read  boolean  flag
tracks notification status, enabling the user interface to distinguish between read and un-
read messages. Together, this schema provides a structured approach to connecting auto-
mated system events with user awareness, enhancing transparency and user engagement
across the platform.
CREATE TABLE IF NOT EXISTS notifications (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email TEXT NOT NULL,
title TEXT NOT NULL,
body TEXT,
meta JSONB,
is_read BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
## );
CREATE INDEX IF NOT EXISTS idx_notifications_email_created_at
ON notifications(email, created_at DESC);
## 3.3.10    Relational Integrity
The PropertyWalay database schema employs foreign key constraints with appropriate
cascading behaviors to maintain referential integrity.  The saved_properties table estab-
lishes a relationship with app_users through an added constraint that uses ON DELETE
SET NULL, preserving analytics data while respecting user deletion requests.
ALTER TABLE IF EXISTS saved_properties
## 52

## 3.3 Data Design
ADD CONSTRAINT IF NOT EXISTS fk_saved_properties_email
FOREIGN KEY (email) REFERENCES app_users(email)
## ON DELETE SET NULL;
The schema supports all functional requirements including real-time listings integration,
property tracking and notifications, AI-powered recommendations, investment insights,
and user history management.  The use of PostgreSQL’s native features such as JSONB
for  semi-structured  data  and  TIMESTAMPTZ  for  timezone-aware  timestamps  ensures
the system can handle the diverse requirements of Pakistan’s real estate market across
multiple cities and time zones.
## 53