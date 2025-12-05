import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, Search } from 'lucide-react';
import HubNavbar from '../components/HubNavbar.jsx';

export default function SyllabusPage() {
  const nav = useNavigate();
  const [expandedSubject, setExpandedSubject] = React.useState(null);
  const [expandedUnit, setExpandedUnit] = React.useState(null);

  const syllabi = [
    {
      subject: 'Computer Networks', abbr:'CN', code:'23CST-335', units:[
        { id:1, title:'Introduction to Computer Networks', hours:15, topics:[
          'Overview of Computer Networks and Distributed Systems',
          'Classification of Computer Networks: PAN, LAN, MAN, WAN',
          'Layered Network Structures: OSI and TCP/IP Models',
          'Data Communication Components: Sender, Receiver, Medium, Message, Protocol',
          'Representation of Data and its Flow (analog, digital)',
          'Network Topologies: Bus, Star, Ring, Mesh, Hybrid',
          'Protocols and Standards: Importance and Examples (IEEE, ITU, ISO)',
          'OSI Model: Layer-wise Functions and Real-World Mapping',
          'Transmission Media: Guided (Twisted Pair, Coaxial, Optical Fiber), Unguided (Radio, Microwave, Infrared)',
          'Wired LANs: Ethernet, IEEE 802.3 Standards',
          'Wireless LANs: IEEE 802.11 Standards, Access Points',
          'Virtual LANs: Definition, VLAN Tagging, Benefits'
        ]},
        { id:2, title:'Bandwidth Utilization and Protocols in Data Link & Network Layer', hours:15, topics:[
          'Frequency Division Multiplexing (FDM)',
          'Time Division Multiplexing (TDM)',
          'Wave Division Multiplexing (WDM)',
          'Spread Spectrum Techniques: DSSS, FHSS',
          'Error Detection and Correction: Parity, Block Coding, Hamming Code, CRC',
          'Flow Control: Stop-and-Wait, Sliding Window Protocol',
          'Error Control Protocols: Go-Back-N, Selective Repeat ARQ, Piggybacking',
          'Medium Access Protocols: ALOHA (Pure, Slotted), CSMA/CD, CSMA/CA',
          'Network Layer Introduction: Functions and Responsibilities',
          'Switching Techniques: Circuit, Message, Packet Switching',
          'Logical Addressing: IPv4 Addressing, Subnetting, IPv6 Overview',
          'Address Mapping: ARP, RARP, BOOTP, DHCP',
          'Packet Delivery and Forwarding: Direct vs Indirect Delivery',
          'Unicast Routing Protocols: RIP, OSPF, BGP'
        ]},
        { id:3, title:'Protocols in Transport & Application Layer, and Network Security', hours:15, topics:[
          'Process-to-Process Communication',
          'UDP: Format, Characteristics, Use Cases',
          'TCP: Connection Establishment, Congestion Control, Features',
          'SCTP: Multi-homing, Multi-streaming, Congestion Control',
          'QoS Concepts: Throughput, Latency, Jitter, Bandwidth',
          'QoS Techniques: Leaky Bucket, Token Bucket Algorithms',
          'Application Layer Protocols: DNS, DDNS, TELNET, EMAIL, FTP, WWW, HTTP, SNMP',
          'Bluetooth and Firewalls: Basics and Functions',
          'Network Security Overview: Threats, Goals (CIA)',
          'Electronic Mail Security: PGP, S/MIME',
          'Directory Services and Network Management Overview',
          'Basic Cryptography: Symmetric, Asymmetric Encryption'
        ]}
      ]
    },
    { subject:'Formal Languages & Automata Theory', abbr:'FLAT', code:'23CST-334', units:[
      { id:1, title:'Finite State Machines And Regular Languages', hours:15, topics:[
        'Basic Mathematics',
        'Introduction to formal language, Basic Terminology: Alphabet, Formal Language, Operations on formal languages',
        'Finite State Machines: Properties and Limitations',
        'Deterministic Finite Automata(DFA)',
        'Non-Deterministic Finite Automata (NFA)',
        'Equivalence of DFA and NDFA',
        'Regular Languages and Regular Expressions',
        'Properties of regular languages',
        'Kleene\'s theorem',
        'Pumping lemma for regular languages'
      ]},
      { id:2, title:'Context Free Grammar, Languages and Pushdown automata', hours:15, topics:[
        'Context-free grammar and language',
        'DESIGNING CONTEXT-FREE GRAMMARS and Parse trees',
        'Ambiguity',
        'Chomsky\'s Normal form',
        'THE PUMPING LEMMA FOR CONTEXT-FREE LANGUAGES',
        'Introduction to Pushdown Automaton (PDA)',
        'PDA CONFIGURATIONS',
        'ACCEPTANCE NOTIONS FOR PDAS',
        'TRANSITION DIAGRAMS FOR PDAS',
        'Equivalence between PDA and CFG',
        'Closure properties of CFL and Relation between CFL and Regular language',
        'Context-sensitive grammars (CSG) and languages',
        'Linear bound automata (LBA) and equivalence with CSG'
      ]},
      { id:3, title:'Turing machine and Complexity theory', hours:15, topics:[
        'Introduction to Turing machines',
        'Multitape Turing machines',
        'Equivalence with Single tape TM and Turing Recognizable languages',
        'Nondeterministic Turing machines, equivalence with deterministic TM and Turing-recognizability based on NDTM',
        'Enumerator and enumerability',
        'Properties of Recursive and Recursively-enumerable languages',
        'THE DEFINITION OF ALGORITHM and CHURCH TURING THESIS',
        'Decidability and undecidability',
        'Chomsky\'s Hierarchy',
        'Reducibility',
        'Introduction to Complexity theory and complexity classes'
      ]}
    ]},
    { subject:'Foundations of Machine Learning', abbr:'FML', code:'23CSH-338', units:[
      { id:1, title:'Introduction to Machine Learning', hours:15, topics:[
        'Definition and Classification of Machine Learning algorithms',
        'Supervised Learning, Unsupervised Learning, Reinforcement Learning, Semi-Supervised Learning',
        'Applications of Machine Learning',
        'Handling Missing data',
        'Encoding Categorical data',
        'Feature Scaling',
        'Handling Time Series data',
        'Feature Selection techniques',
        'Data Transformation',
        'Normalization',
        'Dimensionality reduction',
        'Data Frame Basics',
        'Different types of plots',
        'Plotting fundamentals using Matplotlib',
        'Plotting fundamentals using Seaborn'
      ]},
      { id:2, title:'Supervised Learning', hours:15, topics:[
        'Linear regression',
        'Ridge Regression',
        'Lasso Regression',
        'Bayesian Linear Regression',
        'Types of Classification Algorithm: Binary Classification and Multi-Class Classification',
        'Logistic Regression',
        'K-Nearest Neighbours',
        'Decision Trees',
        'Random Forest',
        'Support Vector Machine',
        'Performance metrics for Regression: Mean Absolute Error, Mean Squared Error, Root Mean Squared Error, R-Squared',
        'Performance metrics for classification: Confusion Matrix, Accuracy, Precision, Recall, F1 score'
      ]},
      { id:3, title:'Unsupervised Learning', hours:15, topics:[
        'Types of Clustering: Centroid-based clustering, Density-based clustering, Distribution-based Clustering and Hierarchical clustering',
        'K- Means Clustering',
        'KNN (K-Nearest Neighbours)',
        'DBSCAN clustering algorithm',
        'Performance metrics for clustering: Silhouette Score',
        'Apriori algorithm',
        'F-P Growth Algorithm',
        'Applications of Association Rule Learning',
        'Market Basket Analysis',
        'Types of Reinforcement learning',
        'Key Features of Reinforcement Learning',
        'Elements of Reinforcement Learning',
        'Applications of Reinforcement Learning'
      ]}
    ]},
    { subject:'Predictive Analytics', abbr:'PA', code:'23CSH-335', units:[
      { id:1, title:'Data Mining Concepts and Handling Data', hours:15, topics:[
        'INTRODUCTION TO DATA MINING: Data-Mining Application, A strategy for Data Mining: CRISP-DM, Stages and Tasks in CRISP-DM, Life Cycle of a Data-Mining Project, Skills Needed for Data Mining',
        'WORKING WITH MODELER: Introducing Nodes and Streams, Explore the user Interface, Creating Streams-General Rules, Placing Nodes, Managing Nodes, Managing Connections, Encapsulating Nodes in a super Node, Generating Nodes from Output, Running Streams',
        'COLLECTING INITIAL DATA: Rectangular Data Structure, The Unit Analysis, Field Storages, Field Measurement Levels, Storage and Measurement level, Fields Instantiation, Importing Data, The Sources Dialog Boxes- Data Tab, Importing Text Files, Exporting data',
        'UNDERSTANDING YOUR DATA: Data Audit, Using Statistics Node and Graphs Nodes for Reporting, Describe Types of Invalid Values, Action for Invalid Values, Dealing with Missing Data, Reporting Blanks in a Data Audit',
        'SETTING THE UNIT OF ANALYSIS: The Required Unit of Analysis, Methods to create datasets with the required unit of analysis, Distincting Records, Aggregating Records, Setting to Flag Fields',
        'A DATA-MINING TOUR: The Basic framework of a Data-Mining Projects, Business Case, A Predictive Model, Deploying the Model, A Data-Mining project in Modeler, Building the Model-Setting roles in Type Node, Score Records, Filter and Sort',
        'INTRODUCTION TO MODELLING: Modelling Objectives, Objectives And Roles In The Type Node, Types Of Classification Models, Rule Induction Models, Traditional Statistical Models, Machine Learning Models, Running Classification Models, Modelling Results: The Model Nugget, Evaluating Classification Models, Applying Classification Models, Segmentation Models, Running Segmentation Models, Examining The Results: Cluster Profiles'
      ]},
      { id:2, title:'Basics of Computing', hours:15, topics:[
        'DERIVING AND RECLASSIFYING FIELDS: Methods To Create Fields, Introducing The Control Language For Expression Manipulation (Clem), Deriving fields And Blanks, Reclassifying Fields, Checking Your Results',
        'LOOKING FOR RELATIONSHIPS: Methods To Examine The Relationship Between Two Fields, Explore Matrix Output, Distribution Output, Means Output, Histogram Output, Statistics Output, Plot Output',
        'Using Date And Time Functions, Using Conversion Functions, Using String Functions, Using Statistical Functions, Using Missing Value Functions',
        'DATA TRANSFORMATIONS: Selecting A Method To Transform Data, Filling Fields, Binning Fields, Data Transformations',
        'WORKING WITH SEQUENCE DATA: Sequence Data, Using Cross-Record Functions, Deriving A Counter Field, Deriving A Counter Field, Restructuring Data, Using Geospatial and Time Data',
        'SAMPLING RECORDS: Selecting A Sampling Method, Selecting A Simple Sampling Method, Selecting A Complex Sampling Method, Using Partitioning, Balancing Record',
        'IMPROVING EFFICIENCY: Using Sql Pushback, Previewing Sql, Identifying A-Typical Values, Processing Missing Values, Imputing Missing Values, Using Globals, Using Parameters, Using Conditional Execution and Looping'
      ]},
      { id:3, title:'Advanced Theories', hours:15, topics:[
        'AUTOMATED DATA MINING: The basics of using a modeler, adding nodes and creating streams in the modeler, Reading data files, Data exploration, Automated data preparation, Data partitioning, Predictor selection for modelling, Automated models for categorical targets, Model evaluation, Automated models for continuous targets, Deploying models'
      ]}
    ]}
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <HubNavbar />

      <main className="pt-32 pb-12 px-6 md:px-12 container mx-auto">
        <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Syllabus</h1>
            <p className="text-neutral-400">Track your curriculum progress and topics.</p>
        </div>

        <div className="space-y-6">
            {syllabi.map((subject, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                    <div 
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-colors"
                        onClick={() => setExpandedSubject(expandedSubject === idx ? null : idx)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white rounded-lg grid place-items-center font-bold text-lg">
                                {subject.abbr}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{subject.subject}</h2>
                                <p className="text-sm text-neutral-500 font-mono">{subject.code}</p>
                            </div>
                        </div>
                        {expandedSubject === idx ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    {expandedSubject === idx && (
                        <div className="border-t border-neutral-800 bg-neutral-950/30">
                            {subject.units.map((unit, uIdx) => (
                                <div key={uIdx} className="border-b border-neutral-800 last:border-0">
                                    <div 
                                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-colors"
                                        onClick={() => setExpandedUnit(expandedUnit === `${idx}-${uIdx}` ? null : `${idx}-${uIdx}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold bg-neutral-800 px-2 py-1 rounded text-neutral-300">UNIT {unit.id}</span>
                                            <span className="font-medium text-neutral-200">{unit.title}</span>
                                        </div>
                                        {expandedUnit === `${idx}-${uIdx}` ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                                    </div>
                                    
                                    {expandedUnit === `${idx}-${uIdx}` && (
                                        <div className="px-6 pb-6 pt-2 pl-14">
                                            <ul className="space-y-2">
                                                {unit.topics.map((topic, tIdx) => (
                                                    <li key={tIdx} className="text-sm text-neutral-400 flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full mt-1.5 flex-shrink-0"></div>
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
