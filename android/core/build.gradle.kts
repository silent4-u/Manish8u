plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    implementation(libs.kotlinx.serialization.json)
    testImplementation(kotlin("test"))
}

// Target Java 17 bytecode for Android compatibility without pinning a
// toolchain, so the module builds on any JDK 17 or newer.
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
    }
}

// The JSON corpus lives once, at the repository root, and is generated from the
// TypeScript sources by `npm run export:content`. Packaging it as a resource
// means the JVM tests and the Android app read exactly the same bytes.
tasks.named<ProcessResources>("processResources") {
    from(rootProject.file("../content")) { into("content") }
}

tasks.test {
    useJUnitPlatform()
    systemProperty("file.encoding", "UTF-8")
    testLogging { events("passed", "failed"); showStandardStreams = true }
}
