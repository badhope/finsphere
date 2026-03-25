# Terraform IaC

## Description
Expert in Terraform infrastructure as code including resource management, state handling, modules, and multi-cloud deployments for AWS, Azure, and GCP.

## Usage Scenario
Use this skill when:
- Writing Terraform configurations
- Managing cloud infrastructure
- Creating reusable modules
- Handling Terraform state
- Multi-cloud deployments
- Infrastructure automation

## Instructions

### Core Concepts

1. **Provider Configuration**
   ```hcl
   terraform {
     required_version = ">= 1.0.0"
     
     required_providers {
       aws = {
         source  = "hashicorp/aws"
         version = "~> 5.0"
       }
       azurerm = {
         source  = "hashicorp/azurerm"
         version = "~> 3.0"
       }
     }
     
     backend "s3" {
       bucket         = "my-terraform-state"
       key            = "prod/terraform.tfstate"
       region         = "us-east-1"
       encrypt        = true
       dynamodb_table = "terraform-locks"
     }
   }
   
   provider "aws" {
     region = var.aws_region
     
     default_tags {
       tags = {
         Environment = var.environment
         ManagedBy   = "Terraform"
       }
     }
   }
   ```

2. **Variables**
   ```hcl
   variable "aws_region" {
     description = "AWS region"
     type        = string
     default     = "us-east-1"
   }
   
   variable "environment" {
     description = "Environment name"
     type        = string
     validation {
       condition     = contains(["dev", "staging", "prod"], var.environment)
       error_message = "Environment must be dev, staging, or prod."
     }
   }
   
   variable "instance_types" {
     description = "Instance types for different environments"
     type        = map(string)
     default = {
       dev     = "t3.micro"
       staging = "t3.small"
       prod    = "t3.medium"
     }
   }
   
   variable "tags" {
     description = "Tags to apply to resources"
     type        = map(string)
     default     = {}
   }
   ```

3. **Outputs**
   ```hcl
   output "vpc_id" {
     description = "The ID of the VPC"
     value       = aws_vpc.main.id
   }
   
   output "instance_ids" {
     description = "IDs of created instances"
     value       = aws_instance.web[*].id
   }
   
   output "load_balancer_dns" {
     description = "DNS name of the load balancer"
     value       = aws_lb.main.dns_name
   }
   ```

### AWS Resources

1. **VPC and Networking**
   ```hcl
   resource "aws_vpc" "main" {
     cidr_block           = var.vpc_cidr
     enable_dns_hostnames = true
     enable_dns_support   = true
     
     tags = {
       Name = "${var.project}-vpc"
     }
   }
   
   resource "aws_subnet" "public" {
     count                   = length(var.public_subnets)
     vpc_id                  = aws_vpc.main.id
     cidr_block              = var.public_subnets[count.index]
     availability_zone       = var.availability_zones[count.index]
     map_public_ip_on_launch = true
     
     tags = {
       Name = "${var.project}-public-${count.index + 1}"
       Type = "public"
     }
   }
   
   resource "aws_subnet" "private" {
     count             = length(var.private_subnets)
     vpc_id            = aws_vpc.main.id
     cidr_block        = var.private_subnets[count.index]
     availability_zone = var.availability_zones[count.index]
     
     tags = {
       Name = "${var.project}-private-${count.index + 1}"
       Type = "private"
     }
   }
   
   resource "aws_internet_gateway" "main" {
     vpc_id = aws_vpc.main.id
     
     tags = {
       Name = "${var.project}-igw"
     }
   }
   
   resource "aws_nat_gateway" "main" {
     allocation_id = aws_eip.nat.id
     subnet_id     = aws_subnet.public[0].id
     
     tags = {
       Name = "${var.project}-nat"
     }
     
     depends_on = [aws_internet_gateway.main]
   }
   ```

2. **EC2 Instances**
   ```hcl
   resource "aws_instance" "web" {
     count         = var.instance_count
     ami           = var.ami_id
     instance_type = var.instance_type
     subnet_id     = aws_subnet.public[count.index % length(aws_subnet.public)].id
     
     vpc_security_group_ids = [aws_security_group.web.id]
     
     user_data = base64encode(templatefile("${path.module}/user_data.sh", {
       environment = var.environment
     }))
     
     tags = {
       Name = "${var.project}-web-${count.index + 1}"
     }
   }
   
   resource "aws_security_group" "web" {
     name        = "${var.project}-web-sg"
     description = "Security group for web servers"
     vpc_id      = aws_vpc.main.id
     
     ingress {
       description = "HTTP"
       from_port   = 80
       to_port     = 80
       protocol    = "tcp"
       cidr_blocks = ["0.0.0.0/0"]
     }
     
     ingress {
       description = "HTTPS"
       from_port   = 443
       to_port     = 443
       protocol    = "tcp"
       cidr_blocks = ["0.0.0.0/0"]
     }
     
     egress {
       from_port   = 0
       to_port     = 0
       protocol    = "-1"
       cidr_blocks = ["0.0.0.0/0"]
     }
   }
   ```

3. **RDS Database**
   ```hcl
   resource "aws_db_subnet_group" "main" {
     name       = "${var.project}-db-subnet"
     subnet_ids = aws_subnet.private[*].id
     
     tags = {
       Name = "${var.project}-db-subnet-group"
     }
   }
   
   resource "aws_db_instance" "main" {
     identifier           = "${var.project}-db"
     engine               = "postgres"
     engine_version       = "15.4"
     instance_class       = "db.t3.medium"
     allocated_storage    = 100
     storage_encrypted    = true
     
     db_name  = "myapp"
     username = var.db_username
     password = var.db_password
     
     db_subnet_group_name   = aws_db_subnet_group.main.name
     vpc_security_group_ids = [aws_security_group.db.id]
     
     backup_retention_period = 7
     skip_final_snapshot     = false
     final_snapshot_identifier = "${var.project}-db-final-snapshot"
     
     tags = {
       Name = "${var.project}-database"
     }
   }
   ```

### Modules

1. **Module Structure**
   ```
   modules/
   └── vpc/
       ├── main.tf
       ├── variables.tf
       ├── outputs.tf
       └── README.md
   ```

2. **Module Definition**
   ```hcl
   resource "aws_vpc" "this" {
     cidr_block = var.cidr_block
     
     enable_dns_hostnames = var.enable_dns_hostnames
     enable_dns_support   = var.enable_dns_support
     
     tags = merge(
       var.tags,
       {
         Name = var.name
       }
     )
   }
   ```

3. **Module Usage**
   ```hcl
   module "vpc" {
     source = "./modules/vpc"
     
     name                = "${var.project}-vpc"
     cidr_block          = var.vpc_cidr
     enable_dns_hostnames = true
     
     tags = var.tags
   }
   ```

### State Management

1. **Remote State**
   ```hcl
   data "terraform_remote_state" "network" {
     backend = "s3"
     
     config = {
       bucket = "my-terraform-state"
       key    = "network/terraform.tfstate"
       region = "us-east-1"
     }
   }
   
   resource "aws_instance" "web" {
     subnet_id = data.terraform_remote_state.network.outputs.subnet_ids[0]
   }
   ```

2. **State Commands**
   ```bash
   terraform state list
   terraform state show aws_instance.web
   terraform state mv aws_instance.web aws_instance.web_new
   terraform state rm aws_instance.old
   terraform import aws_instance.web i-1234567890abcdef0
   ```

### Workspaces

```hcl
terraform {
   backend "s3" {
     bucket = "my-terraform-state"
     key    = "app/terraform.tfstate"
     region = "us-east-1"
   }
}

locals {
  environment = terraform.workspace
}

resource "aws_instance" "web" {
  count         = local.environment == "prod" ? 3 : 1
  instance_type = local.environment == "prod" ? "t3.medium" : "t3.micro"
}
```

```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
terraform workspace select prod
terraform workspace list
```

### Best Practices

1. **File Organization**
   ```
   project/
   ├── main.tf          # Main resources
   ├── variables.tf     # Input variables
   ├── outputs.tf       # Output values
   ├── providers.tf     # Provider configuration
   ├── backend.tf       # Backend configuration
   ├── locals.tf        # Local values
   ├── data.tf          # Data sources
   └── modules/         # Custom modules
   ```

2. **Naming Conventions**
   ```hcl
   resource "aws_instance" "web_server" {
     tags = {
       Name        = "${var.project}-${var.environment}-web"
       Environment = var.environment
       ManagedBy   = "Terraform"
     }
   }
   ```

3. **Use Locals**
   ```hcl
   locals {
     common_tags = {
       Environment = var.environment
       Project     = var.project
       ManagedBy   = "Terraform"
     }
     
     name_prefix = "${var.project}-${var.environment}"
   }
   
   resource "aws_instance" "web" {
     tags = merge(local.common_tags, {
       Name = "${local.name_prefix}-web"
     })
   }
   ```

### CLI Commands

```bash
terraform init
terraform plan
terraform apply
terraform apply -auto-approve
terraform destroy
terraform fmt
terraform validate
terraform taint aws_instance.web
terraform graph | dot -Tpng > graph.png
```

## Output Contract
- Terraform configurations (HCL)
- Module structures
- State management scripts
- CI/CD integration
- Documentation

## Constraints
- Use remote state
- Implement state locking
- Use modules for reusability
- Follow naming conventions
- Enable encryption for sensitive data

## Examples

### Example 1: Complete VPC Module
```hcl
module "vpc" {
  source = "./modules/vpc"
  
  name               = "production"
  cidr               = "10.0.0.0/16"
  azs                = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets    = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway = true
  single_nat_gateway = false
  
  tags = {
    Environment = "production"
    Project     = "myapp"
  }
}
```

### Example 2: Multi-Environment Setup
```hcl
variable "environments" {
  default = {
    dev = {
      instance_count = 1
      instance_type  = "t3.micro"
    }
    staging = {
      instance_count = 2
      instance_type  = "t3.small"
    }
    prod = {
      instance_count = 3
      instance_type  = "t3.medium"
    }
  }
}

resource "aws_instance" "web" {
  count         = var.environments[terraform.workspace].instance_count
  instance_type = var.environments[terraform.workspace].instance_type
  ami           = var.ami_id
  
  tags = {
    Name = "${terraform.workspace}-web-${count.index + 1}"
  }
}
```
