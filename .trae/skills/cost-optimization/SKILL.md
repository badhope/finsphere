# Cost Optimization

## Description
Expert in cloud cost optimization including resource right-sizing, reserved instances, spot instances, and cost monitoring for AWS, GCP, and Azure.

## Usage Scenario
Use this skill when:
- Reducing cloud costs
- Resource optimization
- Reserved instance planning
- Cost monitoring setup
- Budget alerts
- FinOps practices

## Instructions

### AWS Cost Optimization

1. **Right-Sizing Recommendations**
   ```typescript
   import { CloudWatch, EC2 } from 'aws-sdk';
   
   interface InstanceMetrics {
     instanceId: string;
     instanceType: string;
     cpuUtilization: number;
     memoryUtilization: number;
     networkThroughput: number;
     recommendations: string[];
   }
   
   async function analyzeInstanceUtilization(): Promise<InstanceMetrics[]> {
     const ec2 = new EC2();
     const cloudwatch = new CloudWatch();
     
     const instances = await ec2.describeInstances().promise();
     const results: InstanceMetrics[] = [];
     
     for (const reservation of instances.Reservations || []) {
       for (const instance of reservation.Instances || []) {
         const metrics = await getInstanceMetrics(cloudwatch, instance.InstanceId!);
         const recommendations = generateRightSizingRecommendations(
           instance.InstanceType!,
           metrics
         );
         
         results.push({
           instanceId: instance.InstanceId!,
           instanceType: instance.InstanceType!,
           ...metrics,
           recommendations,
         });
       }
     }
     
     return results;
   }
   
   async function getInstanceMetrics(
     cloudwatch: CloudWatch,
     instanceId: string
   ): Promise<Omit<InstanceMetrics, 'instanceId' | 'instanceType' | 'recommendations'>> {
     const end = new Date();
     const start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
     
     const cpu = await cloudwatch.getMetricStatistics({
       Namespace: 'AWS/EC2',
       MetricName: 'CPUUtilization',
       Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
       StartTime: start,
       EndTime: end,
       Period: 86400,
       Statistics: ['Average', 'Maximum'],
     }).promise();
     
     const avgCpu = cpu.Datapoints?.reduce((sum, d) => sum + (d.Average || 0), 0) 
       / (cpu.Datapoints?.length || 1);
     
     return {
       cpuUtilization: avgCpu || 0,
       memoryUtilization: 0,
       networkThroughput: 0,
     };
   }
   
   function generateRightSizingRecommendations(
     instanceType: string,
     metrics: any
   ): string[] {
     const recommendations: string[] = [];
     
     if (metrics.cpuUtilization < 10) {
       recommendations.push(`Consider downsizing: CPU utilization is only ${metrics.cpuUtilization.toFixed(1)}%`);
     } else if (metrics.cpuUtilization < 40) {
       recommendations.push(`Consider smaller instance type: CPU utilization is ${metrics.cpuUtilization.toFixed(1)}%`);
     }
     
     return recommendations;
   }
   ```

2. **Reserved Instance Analysis**
   ```typescript
   import { CostExplorer } from 'aws-sdk';
   
   async function getReservedInstanceRecommendations(): Promise<any[]> {
     const ce = new CostExplorer();
     
     const recommendations = await ce.getReservationPurchaseRecommendation({
       Service: 'Amazon Elastic Compute Cloud - Compute',
       TermInYears: 'ONE_YEAR',
       PaymentOption: 'NO_UPFRONT',
       LookbackPeriodInDays: 'SIXTY_DAYS',
     }).promise();
     
     return recommendations.ReservationPurchaseRecommendations || [];
   }
   
   async function getReservedInstanceCoverage(): Promise<any> {
     const ce = new CostExplorer();
     
     const coverage = await ce.getReservationCoverage({
       TimePeriod: {
         Start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
         End: new Date().toISOString().split('T')[0],
       },
       Granularity: 'MONTHLY',
       GroupBy: [{ Type: 'DIMENSION', Key: 'SUBSCRIPTION_ID' }],
     }).promise();
     
     return coverage;
   }
   
   async function calculateSavingsPotential(): Promise<number> {
     const ce = new CostExplorer();
     
     const savings = await ce.getSavingsPlansPurchaseRecommendation({
       LookbackPeriodInDays: 'SIXTY_DAYS',
       TermInYears: 'ONE_YEAR',
       PaymentOption: 'NO_UPFRONT',
     }).promise();
     
     return savings.SavingsPlansPurchaseRecommendation?.EstimatedMonthlySavings || 0;
   }
   ```

3. **Spot Instance Strategy**
   ```typescript
   import { EC2 } from 'aws-sdk';
   
   async function getSpotPricing(instanceType: string, region: string): Promise<number> {
     const ec2 = new EC2({ region });
     
     const pricing = await ec2.describeSpotPriceHistory({
       InstanceTypes: [instanceType],
       ProductDescriptions: ['Linux/UNIX'],
       StartTime: new Date(),
     }).promise();
     
     return pricing.SpotPriceHistory?.[0]?.SpotPrice || 0;
   }
   
   async function createSpotFleet(
     launchTemplateId: string,
     targetCapacity: number
   ): Promise<string> {
     const ec2 = new EC2();
     
     const result = await ec2.requestSpotFleet({
       SpotFleetRequestConfig: {
         IamFleetRole: 'arn:aws:iam::123456789012:role/spot-fleet-role',
         LaunchTemplateConfigs: [{
           LaunchTemplateSpecification: {
             LaunchTemplateId: launchTemplateId,
             Version: '$Latest',
           },
           Overrides: [
             { InstanceType: 'm5.large', AvailabilityZone: 'us-east-1a' },
             { InstanceType: 'm5.large', AvailabilityZone: 'us-east-1b' },
             { InstanceType: 'm5a.large', AvailabilityZone: 'us-east-1a' },
           ],
         }],
         TargetCapacity: targetCapacity,
         SpotOptions: {
           AllocationStrategy: 'capacity-optimized',
           InstanceInterruptionBehavior: 'terminate',
         },
       },
     }).promise();
     
     return result.SpotFleetRequestId!;
   }
   ```

### Cost Monitoring

1. **AWS Cost Explorer**
   ```typescript
   async function getMonthlyCosts(): Promise<{ service: string; cost: number }[]> {
     const ce = new CostExplorer();
     
     const result = await ce.getCostAndUsage({
       TimePeriod: {
         Start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
           .toISOString().split('T')[0],
         End: new Date().toISOString().split('T')[0],
       },
       Granularity: 'MONTHLY',
       Metrics: ['UnblendedCost'],
       GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }],
     }).promise();
     
     return result.ResultsByTime?.[0]?.Groups?.map((group) => ({
       service: group.Keys?.[0] || '',
       cost: parseFloat(group.Metrics?.UnblendedCost?.Amount || '0'),
     })) || [];
   }
   
   async function getCostForecast(days: number = 30): Promise<number> {
     const ce = new CostExplorer();
     
     const start = new Date();
     const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
     
     const forecast = await ce.getCostForecast({
       TimePeriod: {
         Start: start.toISOString().split('T')[0],
         End: end.toISOString().split('T')[0],
       },
       Metric: 'UNBLENDED_COST',
       Granularity: 'DAILY',
     }).promise();
     
     return forecast.Total?.Amount ? parseFloat(forecast.Total.Amount) : 0;
   }
   ```

2. **Budget Alerts**
   ```typescript
   import { Budgets } from 'aws-sdk';
   
   async function createBudget(
     budgetName: string,
     amount: number,
     emailNotifications: string[]
   ): Promise<void> {
     const budgets = new Budgets();
     
     await budgets.createBudget({
       AccountId: process.env.AWS_ACCOUNT_ID!,
       Budget: {
         BudgetName: budgetName,
         BudgetLimit: {
           Amount: amount,
           Unit: 'USD',
         },
         TimeUnit: 'MONTHLY',
         BudgetType: 'COST',
         CostFilters: {
           Service: ['Amazon Elastic Compute Cloud - Compute'],
         },
       },
       NotificationsWithSubscribers: [
         {
           Notification: {
             NotificationType: 'ACTUAL',
             ComparisonOperator: 'GREATER_THAN',
             Threshold: 80,
             ThresholdType: 'PERCENTAGE',
           },
           Subscribers: emailNotifications.map((email) => ({
             SubscriptionType: 'EMAIL',
             Address: email,
           })),
         },
         {
           Notification: {
             NotificationType: 'FORECASTED',
             ComparisonOperator: 'GREATER_THAN',
             Threshold: 100,
             ThresholdType: 'PERCENTAGE',
           },
           Subscribers: emailNotifications.map((email) => ({
             SubscriptionType: 'EMAIL',
             Address: email,
           })),
         },
       ],
     }).promise();
   }
   ```

### Resource Tagging

```typescript
async function getUntaggedResources(): Promise<string[]> {
  const ec2 = new EC2();
  
  const instances = await ec2.describeInstances().promise();
  const untagged: string[] = [];
  
  for (const reservation of instances.Reservations || []) {
    for (const instance of reservation.Instances || []) {
      const hasCostCenter = instance.Tags?.some(
        (tag) => tag.Key === 'CostCenter'
      );
      
      if (!hasCostCenter) {
        untagged.push(instance.InstanceId!);
      }
    }
  }
  
  return untagged;
}

async function tagResources(resources: string[], tags: Record<string, string>): Promise<void> {
  const ec2 = new EC2();
  
  await ec2.createTags({
    Resources: resources,
    Tags: Object.entries(tags).map(([Key, Value]) => ({ Key, Value })),
  }).promise();
}

async function getCostByTag(tagKey: string): Promise<{ tag: string; cost: number }[]> {
  const ce = new CostExplorer();
  
  const result = await ce.getCostAndUsage({
    TimePeriod: {
      Start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      End: new Date().toISOString().split('T')[0],
    },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost'],
    GroupBy: [{ Type: 'TAG', Key: tagKey }],
  }).promise();
  
  return result.ResultsByTime?.[0]?.Groups?.map((group) => ({
    tag: group.Keys?.[0] || 'untagged',
    cost: parseFloat(group.Metrics?.UnblendedCost?.Amount || '0'),
  })) || [];
}
```

### Storage Optimization

```typescript
async function findUnusedEBSVolumes(): Promise<string[]> {
  const ec2 = new EC2();
  
  const volumes = await ec2.describeVolumes({
    Filters: [{ Name: 'status', Values: ['available'] }],
  }).promise();
  
  return volumes.Volumes?.map((v) => v.VolumeId!) || [];
}

async function findOldSnapshots(daysOld: number = 90): Promise<string[]> {
  const ec2 = new EC2();
  
  const snapshots = await ec2.describeSnapshots({
    OwnerIds: ['self'],
  }).promise();
  
  const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  
  return snapshots.Snapshots?.filter((s) => s.StartTime && s.StartTime < cutoff)
    .map((s) => s.SnapshotId!) || [];
}

async function analyzeS3BucketSizes(): Promise<{ bucket: string; size: number }[]> {
  const cloudwatch = new CloudWatch();
  const s3 = new S3();
  
  const buckets = await s3.listBuckets().promise();
  const results: { bucket: string; size: number }[] = [];
  
  for (const bucket of buckets.Buckets || []) {
     const metrics = await cloudwatch.getMetricStatistics({
       Namespace: 'AWS/S3',
       MetricName: 'BucketSizeBytes',
       Dimensions: [
         { Name: 'BucketName', Value: bucket.Name! },
         { Name: 'StorageType', Value: 'StandardStorage' },
       ],
       StartTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
       EndTime: new Date(),
       Period: 86400,
       Statistics: ['Average'],
     }).promise();
     
     const size = metrics.Datapoints?.[0]?.Average || 0;
     results.push({ bucket: bucket.Name!, size });
   }
   
   return results;
}
```

### Cost Report Generation

```typescript
interface CostReport {
  period: { start: string; end: string };
  totalCost: number;
  byService: { service: string; cost: number; percentage: number }[];
  byTag: { tag: string; cost: number }[];
  recommendations: string[];
  forecast: number;
}

async function generateCostReport(): Promise<CostReport> {
  const ce = new CostExplorer();
  
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = new Date();
  
  const [costs, forecast] = await Promise.all([
    ce.getCostAndUsage({
      TimePeriod: { Start: start.toISOString().split('T')[0], End: end.toISOString().split('T')[0] },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }],
    }).promise(),
    getCostForecast(30),
  ]);
  
  const byService = costs.ResultsByTime?.[0]?.Groups?.map((group) => ({
    service: group.Keys?.[0] || '',
    cost: parseFloat(group.Metrics?.UnblendedCost?.Amount || '0'),
    percentage: 0,
  })) || [];
  
  const totalCost = byService.reduce((sum, s) => sum + s.cost, 0);
  byService.forEach((s) => {
    s.percentage = (s.cost / totalCost) * 100;
  });
  
  const recommendations = await generateRecommendations();
  
  return {
    period: { start: start.toISOString(), end: end.toISOString() },
    totalCost,
    byService,
    byTag: [],
    recommendations,
    forecast,
  };
}

async function generateRecommendations(): Promise<string[]> {
  const recommendations: string[] = [];
  
  const untagged = await getUntaggedResources();
  if (untagged.length > 0) {
    recommendations.push(`Tag ${untagged.length} untagged resources for better cost tracking`);
  }
  
  const unusedVolumes = await findUnusedEBSVolumes();
  if (unusedVolumes.length > 0) {
    recommendations.push(`Delete ${unusedVolumes.length} unused EBS volumes`);
  }
  
  const riCoverage = await getReservedInstanceCoverage();
  // Add RI recommendations
  
  return recommendations;
}
```

## Output Contract
- Cost analysis reports
- Right-sizing recommendations
- Reserved instance plans
- Budget configurations
- Optimization strategies

## Constraints
- Set budget limits
- Monitor continuously
- Tag all resources
- Use spot when possible
- Review regularly

## Examples

### Example 1: Monthly Cost Report
```typescript
async function sendMonthlyCostReport(): Promise<void> {
  const report = await generateCostReport();
  
  const email = `
Monthly Cost Report
==================
Period: ${report.period.start} to ${report.period.end}
Total Cost: $${report.totalCost.toFixed(2)}
Forecast: $${report.forecast.toFixed(2)}

Top Services:
${report.byService.slice(0, 5).map((s) => 
  `  ${s.service}: $${s.cost.toFixed(2)} (${s.percentage.toFixed(1)}%)`
).join('\n')}

Recommendations:
${report.recommendations.map((r) => `  - ${r}`).join('\n')}
  `;
  
  await sendEmail('finance@company.com', 'Monthly AWS Cost Report', email);
}
```

### Example 2: Auto-Terminate Unused Resources
```typescript
async function cleanupUnusedResources(dryRun: boolean = true): Promise<void> {
  const ec2 = new EC2();
  
  // Terminate stopped instances older than 7 days
  const instances = await ec2.describeInstances({
    Filters: [{ Name: 'instance-state-name', Values: ['stopped'] }],
  }).promise();
  
  for (const reservation of instances.Reservations || []) {
    for (const instance of reservation.Instances || []) {
      const launchTime = instance.LaunchTime;
      if (launchTime && Date.now() - launchTime.getTime() > 7 * 24 * 60 * 60 * 1000) {
        if (!dryRun) {
          await ec2.terminateInstances({ InstanceIds: [instance.InstanceId!] }).promise();
        }
        console.log(`Would terminate: ${instance.InstanceId}`);
      }
    }
  }
}
```
