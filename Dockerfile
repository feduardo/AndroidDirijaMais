FROM eclipse-temurin:17-jdk

RUN apt update && apt install -y curl git unzip zip python3 make g++

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs

RUN node --version && npm --version && java --version

ENV ANDROID_HOME /opt/android-sdk
ENV ANDROID_SDK_ROOT /opt/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    cd ${ANDROID_HOME}/cmdline-tools && \
    curl -L https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -o cmdline-tools.zip && \
    unzip cmdline-tools.zip && \
    mv cmdline-tools latest && \
    rm cmdline-tools.zip

RUN yes | sdkmanager --licenses || true

RUN sdkmanager --verbose \
    "platform-tools" \
    "platforms;android-36" \
    "build-tools;34.0.0" \
    "ndk;27.1.12297006" \
    "cmake;3.22.1"

RUN curl -s https://get.sdkman.io | bash
RUN bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install kotlin 2.1.20"

ENV GRADLE_OPTS="-Xmx4096m -Dorg.gradle.daemon=false"
ENV JAVA_OPTS="-Xmx4096m"

WORKDIR /app
COPY . .

RUN npm ci

RUN cd android && \
    chmod +x gradlew && \
    ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a

RUN mkdir -p /output && \
    cp /app/android/app/build/outputs/apk/release/*.apk /output/

CMD ["sh", "-c", "ls -la /output && tail -f /dev/null"]

