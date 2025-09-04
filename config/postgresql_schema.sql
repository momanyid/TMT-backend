-- PostgreSQL Database Schema for Test Management System

-- Create extensions for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(30) NOT NULL UNIQUE,
    last_name VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('Tester', 'Lead', 'Admin', 'QA', 'Developer')) DEFAULT 'Tester',
    is_verified BOOLEAN DEFAULT FALSE,
    reset_password_token VARCHAR(255),
    reset_password_expires_at TIMESTAMP,
    verification_token VARCHAR(255),
    verification_token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Plans table
CREATE TABLE test_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    link VARCHAR(500) NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('Draft', 'In Progress', 'Completed')) DEFAULT 'Draft',
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requirements table
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    req_id VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    test_plan_id UUID NOT NULL REFERENCES test_plans(id) ON DELETE CASCADE,
    main_feature VARCHAR(255),
    feature_subsection VARCHAR(255),
    remarks TEXT,
    status VARCHAR(50),
    test_status VARCHAR(10) CHECK (test_status IN ('Pass', 'Fail')),
    testcase_ids TEXT,
    actions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Cases table
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE,
    test_plan_id UUID NOT NULL REFERENCES test_plans(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES requirements(id),
    title VARCHAR(500) NOT NULL,
    preconditions TEXT,
    test_steps TEXT,
    test_data TEXT,
    test_suite VARCHAR(255),
    expected_results TEXT,
    actual_results TEXT,
    status VARCHAR(50),
    test_type VARCHAR(20) CHECK (test_type IN ('Manual', 'Automated', 'Performance')) DEFAULT 'Manual',
    executed_by_user_id UUID REFERENCES users(id),
    execution_date TIMESTAMP,
    remarks TEXT,
    written_by_user_id UUID REFERENCES users(id),
    link_to_testplan VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Defects table
CREATE TABLE defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_id VARCHAR(50) UNIQUE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50),
    priority VARCHAR(20),
    severity VARCHAR(20),
    steps_to_reproduce TEXT,
    expected_result TEXT,
    actual_result TEXT,
    attachments TEXT,
    environment VARCHAR(255),
    assigned_to_user_id UUID REFERENCES users(id),
    reported_by_user_id UUID NOT NULL REFERENCES users(id),
    date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Suites table
CREATE TABLE test_suites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_suite_name VARCHAR(255) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    bug_id UUID REFERENCES defects(id),
    executed_by VARCHAR(255),
    executed_date VARCHAR(50),
    assigned_to_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Case Executions table
CREATE TABLE test_case_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_suite_name VARCHAR(255) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('Passed', 'Failed', 'Blocked', 'In Progress')) DEFAULT 'In Progress',
    start_date DATE,
    end_date DATE,
    bug_id UUID REFERENCES defects(id),
    executed_by VARCHAR(255),
    executed_date VARCHAR(50),
    assigned_to_user_id UUID REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    generated_by_user_id UUID NOT NULL REFERENCES users(id),
    generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link_to_file VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for Test Suites and Test Cases (many-to-many)
CREATE TABLE test_suite_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_suite_id UUID NOT NULL REFERENCES test_suites(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    UNIQUE(test_suite_id, test_case_id)
);

-- Junction table for Test Case Executions and Test Cases (many-to-many)
CREATE TABLE test_case_execution_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    UNIQUE(test_case_execution_id, test_case_id)
);

-- Junction table for Test Cases and Defects (many-to-many)
CREATE TABLE test_case_defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    defect_id UUID NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
    UNIQUE(test_case_id, defect_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_test_plans_project_id ON test_plans(project_id);
CREATE INDEX idx_requirements_test_plan_id ON requirements(test_plan_id);
CREATE INDEX idx_test_cases_test_plan_id ON test_cases(test_plan_id);
CREATE INDEX idx_test_cases_requirement_id ON test_cases(requirement_id);
CREATE INDEX idx_defects_test_case_id ON defects(test_case_id);
CREATE INDEX idx_defects_reported_by ON defects(reported_by_user_id);
CREATE INDEX idx_test_suites_project_id ON test_suites(project_id);
CREATE INDEX idx_test_case_executions_project_id ON test_case_executions(project_id);
CREATE INDEX idx_reports_generated_by ON reports(generated_by_user_id);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_plans_updated_at BEFORE UPDATE ON test_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_defects_updated_at BEFORE UPDATE ON defects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_suites_updated_at BEFORE UPDATE ON test_suites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_case_executions_updated_at BEFORE UPDATE ON test_case_executions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate defect_id
CREATE OR REPLACE FUNCTION generate_defect_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.defect_id IS NULL THEN
        NEW.defect_id := 'BUG-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((SELECT COUNT(*) + 1 FROM defects)::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate test_case_id
CREATE OR REPLACE FUNCTION generate_test_case_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.test_case_id IS NULL THEN
        NEW.test_case_id := 'TC-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((SELECT COUNT(*) + 1 FROM test_cases)::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-generation of IDs
CREATE TRIGGER generate_defect_id_trigger BEFORE INSERT ON defects FOR EACH ROW EXECUTE FUNCTION generate_defect_id();
CREATE TRIGGER generate_test_case_id_trigger BEFORE INSERT ON test_cases FOR EACH ROW EXECUTE FUNCTION generate_test_case_id();