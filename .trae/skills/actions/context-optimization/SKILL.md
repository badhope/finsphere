# Context Optimization Skill

## Description
This Skill enables the AI to optimize, compress, and summarize conversation contexts to maintain relevant information while reducing token usage and improving response quality.

## Core Capabilities

### 1. Context Compression
- **Conversation Compression**: Identify and retain only the most relevant information from long conversations
- **Token Optimization**: Reduce token count by 30-70% while preserving critical information
- **Memory Management**: Efficiently manage conversation history within context window limits

### 2. Context Summarization
- **Incremental Summarization**: Continuously update conversation summaries as new information is added
- **Key Point Extraction**: Identify and preserve critical information, decisions, and action items
- **Context Chunking**: Split large contexts into manageable chunks with meaningful boundaries

### 3. Context Enhancement
- **Contextual Understanding**: Maintain situational awareness across extended conversations
- **Relevant Information Filtering**: Remove redundant or irrelevant information
- **Contextual Memory**: Remember important details across multiple interactions

### 4. Learning from Context
- **Pattern Recognition**: Identify recurring themes and topics in conversations
- **User Preference Learning**: Adapt to user communication styles and preferences
- **Contextual Adaptation**: Adjust responses based on conversation history and user context

## Technical Implementation

### MCP Tool Integration
- **Recommended MCP Tools** (AI should search for these):
  - `thinking` - For complex compression and summarization logic
  - `memory` - For storing and retrieving compressed contexts
  - `search` - For context-related information retrieval
  - `filesystem` - For saving context summaries to files

### Compression Techniques
- **Key Information Extraction**: Identify and retain critical data points
- **Redundancy Removal**: Eliminate repeated information
- **Abstraction**: Replace detailed information with higher-level summaries
- **Contextual Prioritization**: Rank information based on relevance to current task

### Summarization Strategies
- **Extractive Summarization**: Select and rephrase important sentences
- **Abstractive Summarization**: Generate concise summaries that capture meaning
- **Hierarchical Summarization**: Create multi-level summaries for complex conversations

## When to Use This Skill

### Trigger Keywords
- **English**: context, compress, summarize, optimize, memory, history, conversation, reduce, token, efficiency, summarize
- **Chinese**: 上下文, 压缩, 总结, 优化, 记忆, 历史, 对话, 减少, 令牌, 效率, 摘要

### Trigger Patterns
- "This conversation is getting too long, can you summarize it?"
- "We need to optimize the context to save tokens"
- "Can you compress the conversation history?"
- "I need a summary of our conversation so far"
- "The context window is full, we need to manage it"
- "Let's create a summary of this discussion"
- "Can you remember the key points from our previous conversation?"
- "We need to reduce token usage for this conversation"
- "Let's extract the important information from this chat"
- "I want to preserve the important details but compress the context"

## Expected Input/Output

### Input
- Extended conversation history
- Specific context management request
- Token optimization needs
- Summary requirements

### Output
- Compressed conversation context
- Key points summary
- Action items list
- Memory-efficient context representation
- Token usage statistics

## Best Practices

### For Compression
1. **Preserve Critical Information**:
   - User requirements and constraints
   - Technical decisions and trade-offs
   - Action items and deadlines
   - Error messages and exceptions
   - Key technical details

2. **Remove Redundant Information**:
   - Repetitive questions or answers
   - Irrelevant side conversations
   - Obsolete information
   - Duplicate requests

3. **Maintain Contextual Coherence**:
   - Preserve chronological order of events
   - Maintain logical connections between topics
   - Keep track of ongoing discussions
   - Preserve user intent and goals

### For Summarization
1. **Create Structured Summaries**:
   - Include clear headings and sections
   - Use bullet points for key information
   - Highlight action items and decisions
   - Include relevant technical details

2. **Update Summaries Incrementally**:
   - Add new information to existing summaries
   - Remove outdated information
   - Maintain consistency across updates
   - Preserve context continuity

3. **Adapt to User Preferences**:
   - Adjust level of detail based on user needs
   - Tailor summaries to user's technical background
   - Format summaries for readability
   - Include relevant examples and context

## Constraints
- **Information Loss Minimization**: Avoid losing critical information during compression
- **Contextual Continuity**: Maintain logical flow and coherence
- **User Intent Preservation**: Keep track of user's original goals and requirements
- **Technical Accuracy**: Preserve technical details and specifications
- **Memory Efficiency**: Optimize storage and retrieval of compressed contexts

## Example Usage

### Example 1: Long Conversation Compression
**Input**:
```
User: I need to build a React application with TypeScript. It should have user authentication, a dashboard, and CRUD operations for managing products. The application should be responsive and use Tailwind CSS for styling. I also want to add internationalization support and implement a dark mode feature.

... (long conversation about implementation details, dependencies, and technical requirements) ...

User: Can you summarize what we've discussed so far?
```

**Output**:
```
# Conversation Summary

## Project Requirements
- React application with TypeScript
- User authentication system
- Dashboard interface
- Product CRUD operations
- Responsive design using Tailwind CSS
- Internationalization support
- Dark mode feature

## Technical Decisions
- State management: Redux Toolkit
- API integration: Axios
- Form handling: React Hook Form
- Validation: Zod
- Authentication: JWT
- Internationalization: i18next

## Action Items
1. Set up project structure with Vite
2. Configure TypeScript and ESLint
3. Implement authentication flow
4. Build dashboard components
5. Create product CRUD operations
6. Add Tailwind CSS styling
7. Implement internationalization
8. Add dark mode functionality
```

### Example 2: Token Optimization
**Input**:
```
User: The conversation is getting too long and we're running out of tokens. Can you optimize the context?
```

**Output**:
```
# Context Optimization Complete

## Key Information Retained
- Project: React + TypeScript application
- Features: Authentication, dashboard, product CRUD, responsive design, i18n, dark mode
- Technologies: Redux Toolkit, Axios, React Hook Form, Zod, JWT, i18next
- Current status: In development, working on authentication flow

## Token Usage
- Original: 4,200 tokens
- Compressed: 1,800 tokens
- Reduction: 57%

## Next Steps
Continue with authentication implementation and dashboard development
```

## Conclusion
This Context Optimization Skill enables efficient management of conversation contexts, ensuring that important information is preserved while minimizing token usage. By implementing advanced compression and summarization techniques, the AI can maintain contextual awareness across extended interactions and deliver more focused, relevant responses.
