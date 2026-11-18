pluginManagement {
    repositories {
        // google() is required for the app module and is unreachable from
        // restricted sandboxes; see ANDROID_PORT.md.
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "lok-sewa-sathi"

// :core is pure Kotlin and builds anywhere. :app needs the Android SDK, so it
// is only included when one is configured — that way `gradle :core:test`
// still works in an environment without it. `-PcoreOnly` skips :app even when
// an SDK is present, as on GitHub's runners, which ship one.
include(":core")

val coreOnly = providers.gradleProperty("coreOnly").isPresent
val hasAndroidSdk = !System.getenv("ANDROID_HOME").isNullOrBlank() ||
    !System.getenv("ANDROID_SDK_ROOT").isNullOrBlank() ||
    file("local.properties").takeIf { it.exists() }
        ?.readLines()?.any { it.startsWith("sdk.dir") } == true

if (hasAndroidSdk && !coreOnly) {
    include(":app")
} else if (coreOnly) {
    logger.lifecycle("-PcoreOnly set — skipping :app.")
} else {
    logger.lifecycle("Android SDK not found — skipping :app. Core logic still builds and tests.")
}
