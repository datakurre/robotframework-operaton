JAVA := $(shell which java)
JAVA_FILES := $(shell find . -name "*.java" -path "*/src/*" -not -path "./tmp/*" -type f)

.PHONY: all
all: build

.PHONY: build
build:
	mvn package -DskipTests

.PHONY: test
test:
	mvn test

.PHONY: check
check:
	mvn verify

.PHONY: format
format:
	google-java-format -i $(JAVA_FILES)

.PHONY: clean
clean:
	mvn clean

.PHONY: native
native:
	mvn -Pnative package

.PHONY: robot
robot:
	mvn exec:exec -Dexec.executable="$(JAVA)" -Dexec.classpathScope=test -Dexec.args="-cp %classpath org.operaton.bpm.extension.robot.Robot ${SUITE}"

.PHONY: shell
shell:
	devenv shell
