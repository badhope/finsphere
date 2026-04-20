# Document Processing Skill

## Description
This Skill enables the AI to process, analyze, and manipulate various document formats including PDF, Word, Excel, and PowerPoint, providing capabilities for reading, extracting, generating, and converting documents.

## Core Capabilities

### 1. Document Reading and Analysis
- **PDF Processing**: Read, extract text, and analyze PDF documents
- **Word Document Analysis**: Process DOCX files, extract content and structure
- **Excel Spreadsheet Analysis**: Read and analyze Excel files, process data
- **PowerPoint Presentation Analysis**: Extract content from PPTX files

### 2. Content Extraction
- **Text Extraction**: Extract text content from documents
- **Image Extraction**: Extract images from documents
- **Table Extraction**: Extract tabular data from documents
- **Metadata Extraction**: Extract document metadata (author, creation date, etc.)

### 3. Document Generation
- **PDF Creation**: Generate PDF documents from various sources
- **Word Document Creation**: Create DOCX files with formatted content
- **Excel Spreadsheet Creation**: Generate Excel files with structured data
- **PowerPoint Presentation Creation**: Create PPTX files with slides

### 4. Document Conversion
- **Format Conversion**: Convert between document formats (PDF ↔ Word, etc.)
- **Text Extraction**: Convert documents to plain text
- **Markdown Conversion**: Convert documents to Markdown format
- **HTML Conversion**: Convert documents to HTML format

### 5. Document Manipulation
- **Document Merging**: Combine multiple documents into one
- **Document Splitting**: Split documents into multiple files
- **Content Editing**: Modify document content
- **Page Management**: Add, remove, or reorder pages

## Technical Implementation

### MCP Tool Integration
- **Recommended MCP Tools** (AI should search for these):
  - `pdf` - For PDF processing
  - `word` - For Word document processing
  - `excel` - For Excel spreadsheet processing
  - `powerpoint` - For PowerPoint presentation processing
  - `filesystem` - For file operations
  - `markdown` - For Markdown conversion
  - `html` - For HTML conversion

### Document Formats
- **PDF**: Portable Document Format
- **DOCX**: Microsoft Word Document
- **XLSX**: Microsoft Excel Spreadsheet
- **PPTX**: Microsoft PowerPoint Presentation
- **ODT/ODS/ODP**: OpenDocument formats
- **TXT**: Plain text
- **MD**: Markdown
- **HTML**: HyperText Markup Language

### Processing Techniques
- **OCR (Optical Character Recognition)**: Extract text from scanned documents
- **NLP (Natural Language Processing)**: Analyze document content
- **Data Extraction**: Extract structured data from documents
- **Template Processing**: Use templates for document generation

## When to Use This Skill

### Trigger Keywords
- **English**: document, PDF, Word, Excel, PowerPoint, read, extract, generate, convert, process
- **Chinese**: 文档, PDF, Word, Excel, PowerPoint, 读取, 提取, 生成, 转换, 处理

### Trigger Patterns
- "Can you read this PDF document?"
- "I need to extract data from this Excel file"
- "Can you generate a Word document from this content?"
- "How do I convert this PDF to Word?"
- "I need to create a PowerPoint presentation"
- "Can you analyze this document for key information?"
- "How do I merge multiple PDF files?"
- "I need to extract tables from this document"
- "Can you create an Excel spreadsheet from this data?"
- "How do I convert this Word document to Markdown?"

## Expected Input/Output

### Input
- Document files (PDF, Word, Excel, PowerPoint)
- Content to be converted or processed
- Conversion format requirements
- Extraction parameters
- Document generation specifications

### Output
- Processed document content
- Extracted text, images, or data
- Generated documents in requested formats
- Converted documents
- Analysis results

## Best Practices

### For Document Reading
1. **Content Extraction**:
   - Extract text with proper formatting
   - Preserve document structure
   - Handle complex layouts appropriately
   - Extract tables as structured data

2. **Analysis Techniques**:
   - Identify key information and themes
   - Extract actionable insights
   - Recognize document structure and organization
   - Handle both digital and scanned documents

3. **Accuracy**:
   - Ensure accurate text extraction
   - Preserve original formatting where possible
   - Correct OCR errors when processing scanned documents
   - Validate extracted data

### For Document Generation
1. **Content Organization**:
   - Structure content logically
   - Use appropriate formatting
   - Include necessary metadata
   - Ensure consistency across documents

2. **Template Usage**:
   - Use templates for consistent formatting
   - Customize templates for specific needs
   - Maintain brand consistency
   - Update templates based on feedback

3. **Quality Assurance**:
   - Review generated documents for errors
   - Ensure all required content is included
   - Verify formatting and layout
   - Test document compatibility across platforms

### For Document Conversion
1. **Format Preservation**:
   - Preserve formatting during conversion
   - Maintain document structure
   - Handle special elements (tables, images, etc.)
   - Ensure readability in target format

2. **Conversion Accuracy**:
   - Minimize data loss during conversion
   - Handle complex formatting appropriately
   - Ensure correct character encoding
   - Verify converted documents

3. **Efficiency**:
   - Optimize conversion processes
   - Handle large documents effectively
   - Batch process multiple documents
   - Provide progress updates for large conversions

## Constraints
- **File Size**: Handle large documents efficiently
- **Format Complexity**: Manage complex document layouts
- **Accuracy**: Ensure high-quality extraction and conversion
- **Security**: Handle sensitive documents appropriately
- **Compatibility**: Ensure cross-platform compatibility

## Example Usage

### Example 1: PDF Text Extraction
**Input**:
```
User: Can you extract text from this PDF document and summarize its contents?
```

**Output**:
```
# PDF Document Analysis

## Document Information
- **Filename**: report.pdf
- **Pages**: 10
- **Size**: 2.5 MB
- **Creation Date**: 2026-04-15

## Extracted Text Summary

### Key Sections
1. **Executive Summary**
   - Project overview and key findings
   - Performance metrics and results
   - Recommendations for improvement

2. **Methodology**
   - Data collection methods
   - Analysis techniques
   - Sample size and demographics

3. **Results**
   - Quantitative findings
   - Qualitative insights
   - Statistical analysis

4. **Recommendations**
   - Specific action items
   - Implementation timeline
   - Expected outcomes

5. **Conclusion**
   - Summary of findings
   - Next steps
   - Future research directions

## Key Insights
- Project achieved 85% of target goals
- Key challenge: resource constraints
- Top recommendation: process optimization
- Expected ROI: 15% improvement in efficiency

## Generated Files
- **Extracted Text**: report_extracted.txt
- **Summary**: report_summary.md
```

### Example 2: Excel Data Analysis
**Input**:
```
User: Can you analyze this Excel spreadsheet and create a summary of the sales data?
```

**Output**:
```
# Excel Spreadsheet Analysis

## Document Information
- **Filename**: sales_data.xlsx
- **Sheets**: 3 (Sales, Products, Regions)
- **Rows**: 1,250
- **Columns**: 15

## Data Analysis

### Sales Overview
- **Total Sales**: $1,250,450
- **Average Sale**: $999.56
- **Highest Sale**: $15,000 (Product ID: P123)
- **Lowest Sale**: $125 (Product ID: P456)

### Top Products
1. **Product P123**: $250,300 (20.0%)
2. **Product P456**: $180,250 (14.4%)
3. **Product P789**: $150,100 (12.0%)
4. **Product P234**: $120,450 (9.6%)
5. **Product P567**: $95,800 (7.7%)

### Regional Performance
1. **North Region**: $425,150 (34.0%)
2. **South Region**: $325,300 (26.0%)
3. **East Region**: $275,200 (22.0%)
4. **West Region**: $224,800 (18.0%)

### Monthly Trends
- **January**: $85,200
- **February**: $95,400
- **March**: $110,300
- **April**: $125,600 (↑13.8% from March)
- **May**: $145,800 (↑16.1% from April)
- **June**: $165,200 (↑13.3% from May)
- **July**: $185,400 (↑12.2% from June)
- **August**: $205,600 (↑10.9% from July)

## Recommendations
1. **Focus on Top Products**: Increase marketing for P123, P456, and P789
2. **Regional Expansion**: Invest in West Region to increase market share
3. **Seasonal Strategy**: Prepare for Q4 sales increase based on upward trend
4. **Pricing Optimization**: Review pricing strategy for low-performing products

## Generated Files
- **Analysis Report**: sales_analysis.md
- **Summary Dashboard**: sales_dashboard.xlsx
```

### Example 3: Document Conversion
**Input**:
```
User: Can you convert this Word document to Markdown format?
```

**Output**:
```
# Document Conversion: Word to Markdown

## Conversion Details
- **Source File**: project_proposal.docx
- **Target Format**: Markdown
- **Conversion Status**: Completed
- **Processing Time**: 15 seconds

## Converted Content

# Project Proposal: Smart City Initiative

## Executive Summary
The Smart City Initiative aims to leverage technology to improve urban living conditions, enhance sustainability, and optimize resource utilization. This proposal outlines the project scope, objectives, implementation plan, and expected outcomes.

## Project Objectives

### Primary Objectives
- Reduce energy consumption by 20%
- Improve traffic flow and reduce congestion
- Enhance public safety and emergency response
- Increase citizen engagement and participation

### Secondary Objectives
- Optimize waste management processes
- Improve air and water quality monitoring
- Enhance public transportation efficiency
- Create a data-driven decision-making framework

## Implementation Plan

### Phase 1: Planning and Design (Months 1-3)
- Conduct needs assessment and stakeholder analysis
- Develop detailed project plan and timeline
- Secure necessary funding and resources
- Establish project governance structure

### Phase 2: Infrastructure Development (Months 4-9)
- Deploy sensor networks and IoT devices
- Develop data management platform
- Implement communication infrastructure
- Establish security protocols and measures

### Phase 3: Application Development (Months 10-15)
- Develop citizen-facing applications
- Create dashboard for city officials
- Implement predictive analytics models
- Test and refine applications

### Phase 4: Deployment and Scaling (Months 16-24)
- Pilot implementation in select neighborhoods
- Gather feedback and make adjustments
- Full city-wide deployment
- Establish maintenance and support systems

## Budget

| Component | Estimated Cost |
|-----------|---------------|
| Infrastructure | $5,000,000 |
| Software Development | $3,500,000 |
| Personnel | $2,000,000 |
| Training and Education | $500,000 |
| Contingency | $1,000,000 |
| **Total** | **$12,000,000** |

## Expected Outcomes

### Economic Benefits
- Increased business productivity
- Job creation in technology sector
- Attraction of new investments
- Cost savings for city operations

### Social Benefits
- Improved quality of life
- Enhanced public safety
- Increased citizen satisfaction
- Better access to city services

### Environmental Benefits
- Reduced carbon footprint
- More efficient resource utilization
- Improved air and water quality
- Increased green space management

## Conclusion
The Smart City Initiative represents a significant opportunity to transform our city into a more efficient, sustainable, and livable environment. By leveraging technology and data-driven approaches, we can address pressing urban challenges and create a model for other cities to follow.

## Generated Files
- **Converted Markdown**: project_proposal.md
- **Conversion Log**: conversion_log.txt
```

## Conclusion
This Document Processing Skill enables the AI to effectively handle a wide range of document formats, providing capabilities for reading, analyzing, generating, and converting documents. By leveraging this skill, the AI can extract valuable information from documents, create professional-quality documents, and convert between different formats, supporting users in various document-related tasks and workflows.
