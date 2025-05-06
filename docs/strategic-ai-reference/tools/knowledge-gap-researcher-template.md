# Knowledge Gap Researcher Template

## Overview

This template provides a framework for identifying knowledge gaps in user conversations and generating targeted research questions to address those gaps. It integrates VibeCheck capabilities for sentiment analysis and knowledge assessment, combined with the structured research question framework.

## Process Flow

1. **Conversation Analysis**: Recursively analyze conversation history to identify potential knowledge gaps
2. **VibeCheck Integration**: Run sentiment analysis on user's domain knowledge
3. **Gap Identification**: Pinpoint specific areas where the user shows uncertainty or lacks key information
4. **Research Question Generation**: Create structured research questions targeting identified gaps
5. **Knowledge Delivery**: Present findings in a format optimized for the user's learning style

## Implementation Components

### 1. Conversation Analyzer

```typescript
// src/tools/ConversationAnalyzer.ts
export class ConversationAnalyzer {
  async analyzeConversation(conversationHistory: Message[]): Promise<KnowledgeGapMap> {
    // Extract topics from conversation
    const topics = await this.extractTopics(conversationHistory);
    
    // Identify knowledge gaps for each topic
    const knowledgeGapMap = new Map<string, KnowledgeGap[]>();
    for (const topic of topics) {
      const gaps = await this.identifyGaps(topic, conversationHistory);
      knowledgeGapMap.set(topic, gaps);
    }
    
    return knowledgeGapMap;
  }
  
  private async extractTopics(conversationHistory: Message[]): Promise<string[]> {
    // Use NLP to extract main topics from conversation
    // Return array of topic strings
  }
  
  private async identifyGaps(topic: string, conversationHistory: Message[]): Promise<KnowledgeGap[]> {
    // Analyze conversation for signs of uncertainty or knowledge gaps related to topic
    // Return array of KnowledgeGap objects
  }
}
```

### 2. VibeCheck Knowledge Assessment

```typescript
// src/tools/VibeCheckKnowledgeAssessor.ts
export class VibeCheckKnowledgeAssessor {
  async assessKnowledge(userMessages: Message[], domain: string): Promise<KnowledgeAssessment> {
    // Use VibeCheck to analyze user's knowledge level in the specified domain
    const vibeCheckResult = await this.vibeCheckClient.check({
      phase: 'analysis',
      userRequest: `Assess my knowledge of ${domain}`,
      plan: userMessages.map(m => m.content).join('\n'),
      confidence: 0.8,
      focusAreas: ['domain_knowledge', 'terminology_usage', 'conceptual_understanding']
    });
    
    // Parse VibeCheck result to extract knowledge assessment
    return this.parseVibeCheckResult(vibeCheckResult);
  }
  
  private parseVibeCheckResult(vibeCheckResult: any): KnowledgeAssessment {
    // Extract knowledge level, identified gaps, and confidence from VibeCheck result
    // Return structured KnowledgeAssessment object
  }
}
```

### 3. Research Question Generator

```typescript
// src/tools/ResearchQuestionGenerator.ts
export class ResearchQuestionGenerator {
  async generateQuestions(knowledgeGaps: KnowledgeGap[], domainAssessment: KnowledgeAssessment): Promise<ResearchQuestion[]> {
    const questions: ResearchQuestion[] = [];
    
    for (const gap of knowledgeGaps) {
      // Generate research question based on knowledge gap and domain assessment
      const question = await this.createStructuredQuestion(gap, domainAssessment);
      questions.push(question);
    }
    
    return questions;
  }
  
  private async createStructuredQuestion(gap: KnowledgeGap, assessment: KnowledgeAssessment): Promise<ResearchQuestion> {
    // Create structured research question following the research question framework
    // Include clear topic, temporal boundaries, focus areas, expected outputs, etc.
    // Return ResearchQuestion object
  }
}
```

### 4. Deep Researcher Integration

```typescript
// src/tools/DeepResearcher.ts
export class DeepResearcher {
  async research(question: ResearchQuestion): Promise<ResearchFindings> {
    // Use Local Deep Researcher to investigate the research question
    // Generate web search queries
    // Gather and analyze search results
    // Return structured findings
  }
  
  async distillFindings(findings: ResearchFindings, userKnowledgeLevel: string): Promise<DistilledKnowledge> {
    // Use VibeDistill to simplify findings based on user's knowledge level
    const distilledContent = await this.vibeCheckClient.distill({
      plan: JSON.stringify(findings),
      userRequest: `Explain at ${userKnowledgeLevel} knowledge level`
    });
    
    // Format distilled content for presentation
    return this.formatDistilledContent(distilledContent);
  }
  
  private formatDistilledContent(distilledContent: string): DistilledKnowledge {
    // Format the distilled content into a structured DistilledKnowledge object
    // Include main points, examples, code snippets, etc.
  }
}
```

## Usage Example

```typescript
// Example usage in an agent workflow
async function identifyAndResearchKnowledgeGaps(conversationHistory: Message[]): Promise<ResearchResponse> {
  // Initialize components
  const analyzer = new ConversationAnalyzer();
  const assessor = new VibeCheckKnowledgeAssessor();
  const generator = new ResearchQuestionGenerator();
  const researcher = new DeepResearcher();
  
  // Analyze conversation to identify potential knowledge gaps
  const knowledgeGapMap = await analyzer.analyzeConversation(conversationHistory);
  
  // Extract main domain from conversation
  const domain = extractMainDomain(knowledgeGapMap);
  
  // Assess user's knowledge level in the domain
  const knowledgeAssessment = await assessor.assessKnowledge(
    conversationHistory.filter(m => m.role === 'user'),
    domain
  );
  
  // Generate research questions for identified gaps
  const gaps = Array.from(knowledgeGapMap.values()).flat();
  const researchQuestions = await generator.generateQuestions(gaps, knowledgeAssessment);
  
  // Prioritize questions based on importance and user needs
  const prioritizedQuestions = prioritizeQuestions(researchQuestions, knowledgeAssessment);
  
  // Research the top priority question
  const findings = await researcher.research(prioritizedQuestions[0]);
  
  // Distill findings based on user's knowledge level
  const distilledKnowledge = await researcher.distillFindings(
    findings,
    knowledgeAssessment.level
  );
  
  // Record learning for future reference
  await recordLearning(domain, gaps, findings);
  
  return {
    question: prioritizedQuestions[0],
    findings: distilledKnowledge,
    additionalQuestions: prioritizedQuestions.slice(1)
  };
}
```

## Example Research Questions for Common Knowledge Gaps

### 1. File Operation Safety Systems

```
Research Question — File Operation Safety Systems in TypeScript Orchestration Frameworks

Researcher Task:
Investigate implementation patterns (2023-2025) for file operation safety systems in TypeScript orchestration frameworks, focusing specifically on diff-based file updates, file locking mechanisms, and version control integration. Analyze approaches for preventing concurrent overwrites while maintaining high performance in multi-agent systems where multiple processes might attempt to modify the same files. Compare optimized diff algorithms suitable for YAML and markdown files, implementation patterns for atomic write operations with rollback capabilities, and conflict resolution strategies. Prioritize solutions that integrate with git workflows and provide clear audit trails of modifications. Provide code examples demonstrating modular implementations in TypeScript that could be integrated into existing architectures with minimal refactoring.
```

### 2. Memory Management in Multi-Agent Systems

```
Research Question — Memory Management Architectures for Multi-Agent LLM Systems

Researcher Task:
Investigate advanced memory management architectures (2022-2025) for multi-agent LLM systems that enable coherent, persistent knowledge across agent boundaries. Focus on mechanisms for shared episodic memory, distributed semantic knowledge, and synchronized mental models that maintain consistency while respecting agent specializations. Compare approaches including centralized knowledge graphs, federated vector stores, and hierarchical memory structures in terms of their information accessibility, update propagation efficiency, and conflict resolution capabilities. Evaluate implementations that successfully balance local agent autonomy with system-wide coherence, particularly in environments with heterogeneous models and specialized roles. Provide concrete examples of memory synchronization protocols, state sharing mechanisms, and context persistence techniques that have demonstrated effectiveness in production systems.
```

### 3. VibeCheck Integration Patterns

```
Research Question — VibeCheck Integration Patterns for Multi-Agent Orchestration

Researcher Task:
Explore integration patterns (2023-2025) for incorporating metacognitive services like VibeCheck into multi-agent orchestration systems. Focus on architectural approaches for background processing, sentiment analysis integration, and knowledge assessment without disrupting primary agent workflows. Compare implementation strategies for real-time knowledge gap detection, adaptive response generation, and continuous learning from interaction patterns. Evaluate methods for balancing computational overhead against improved response quality, particularly in systems with strict latency requirements. Provide code examples of integration patterns that maintain loose coupling between metacognitive services and core agent functionality, enabling flexible deployment and graceful degradation when services are unavailable.
```

## Integration with Memory System

This knowledge gap researcher template integrates with the Memory Storage Matrix as follows:

| Event/Information Type | Storage Location | Trigger Condition |
|------------------------|------------------|-------------------|
| Identified Knowledge Gaps | Knowledge Graph | After gap analysis |
| Generated Research Questions | Cursor Memory Bank | When questions are created |
| Research Findings | Project Files | After research completion |
| User Knowledge Assessment | mem0-memory | After VibeCheck analysis |
| Learning Patterns | VibeCheck Memory | After multiple interactions |

## Next Steps

1. Implement the `ConversationAnalyzer` class for identifying potential knowledge gaps
2. Integrate VibeCheck for sentiment analysis and knowledge assessment
3. Develop the `ResearchQuestionGenerator` following the research question framework
4. Connect with Local Deep Researcher for executing research queries
5. Create a feedback loop for continuous improvement of knowledge gap detection

## Related Files

- `src/tools/ConversationAnalyzer.ts` (proposed)
- `src/tools/VibeCheckKnowledgeAssessor.ts` (proposed)
- `src/tools/ResearchQuestionGenerator.ts` (proposed)
- `src/tools/DeepResearcher.ts` (proposed)
- `docs/strategic-ai-reference/memory/development-patterns-memory-integration.md`
- `archive/researcherReferenceTemplate/Research_Question_Framework.md`
