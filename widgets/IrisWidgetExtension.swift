import WidgetKit
import SwiftUI

// MARK: - Widget Entry Model
struct IrisWidgetEntry: TimelineEntry {
    let date: Date
    let phaseName: String
    let phaseColor: String
    let cycleDay: Int
    let totalCycleDays: Int
    let todaysFocus: String
    let lastUpdated: String
    let hasData: Bool
}

// MARK: - Widget Provider
struct IrisWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> IrisWidgetEntry {
        IrisWidgetEntry(
            date: Date(),
            phaseName: "Follicular",
            phaseColor: "#FFB627",
            cycleDay: 14,
            totalCycleDays: 28,
            todaysFocus: "Focus on building energy and momentum",
            lastUpdated: "Now",
            hasData: true
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (IrisWidgetEntry) -> ()) {
        let entry = loadWidgetData()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<IrisWidgetEntry>) -> ()) {
        let currentDate = Date()
        // Update every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: currentDate) ?? currentDate.addingTimeInterval(3600)

        let entry = loadWidgetData()
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))

        completion(timeline)
    }

    private func loadWidgetData() -> IrisWidgetEntry {
        let defaults = UserDefaults(suiteName: "group.se.mojjo.iris")

        if let jsonData = defaults?.data(forKey: "iris_widget_data"),
           let jsonString = String(data: jsonData, encoding: .utf8),
           let widgetDataDict = try? JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] {

            let phaseName = widgetDataDict["phaseName"] as? String ?? "Loading..."
            let phaseColor = widgetDataDict["phaseColor"] as? String ?? "#E89BA4"
            let cycleDay = widgetDataDict["cycleDay"] as? Int ?? 0
            let totalCycleDays = widgetDataDict["totalCycleDays"] as? Int ?? 28
            let todaysFocus = widgetDataDict["todaysFocus"] as? String ?? "Open IRIS for insights"
            let lastUpdated = widgetDataDict["lastUpdated"] as? TimeInterval ?? 0
            let hasData = widgetDataDict["hasData"] as? Bool ?? false

            let lastUpdatedString = formatLastUpdated(lastUpdated)

            return IrisWidgetEntry(
                date: Date(),
                phaseName: phaseName,
                phaseColor: phaseColor,
                cycleDay: cycleDay,
                totalCycleDays: totalCycleDays,
                todaysFocus: todaysFocus,
                lastUpdated: lastUpdatedString,
                hasData: hasData
            )
        }

        // Return default/empty state
        return IrisWidgetEntry(
            date: Date(),
            phaseName: "Loading...",
            phaseColor: "#E89BA4",
            cycleDay: 0,
            totalCycleDays: 28,
            todaysFocus: "Open IRIS for personalized insights",
            lastUpdated: "Never",
            hasData: false
        )
    }

    private func formatLastUpdated(_ timestamp: TimeInterval) -> String {
        guard timestamp > 0 else { return "Never" }

        let date = Date(timeIntervalSince1970: timestamp / 1000)
        let now = Date()
        let diff = now.timeIntervalSince(date)

        if diff < 60 {
            return "Just now"
        } else if diff < 3600 {
            let minutes = Int(diff / 60)
            return "\(minutes)m ago"
        } else if diff < 86400 {
            let hours = Int(diff / 3600)
            return "\(hours)h ago"
        } else {
            let days = Int(diff / 86400)
            if days < 7 {
                return "\(days)d ago"
            }
        }

        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return formatter.string(from: date)
    }
}

// MARK: - Widget Views
struct IrisWidgetSmallView: View {
    var entry: IrisWidgetEntry

    var phaseColorHex: Color {
        Color(hex: entry.phaseColor)
    }

    var body: some View {
        ZStack {
            phaseColorHex.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 12) {
                // Phase Name
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(entry.phaseName)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)

                    Text("Phase")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }

                // Cycle Day
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("Day \(entry.cycleDay)")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)

                    Text("of \(entry.totalCycleDays)")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.white.opacity(0.8))
                }

                Spacer()

                // Footer
                HStack {
                    Text("IRIS")
                        .font(.system(size: 12, weight: .bold))
                        .tracking(2)
                        .foregroundColor(.white.opacity(0.8))

                    Spacer()

                    Text(entry.lastUpdated)
                        .font(.system(size: 10, weight: .regular))
                        .foregroundColor(.white.opacity(0.6))
                }
            }
            .padding(16)
        }
    }
}

struct IrisWidgetMediumView: View {
    var entry: IrisWidgetEntry

    var phaseColorHex: Color {
        Color(hex: entry.phaseColor)
    }

    var body: some View {
        ZStack {
            phaseColorHex.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 12) {
                // Phase Name
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(entry.phaseName)
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(.white)

                    Text("Phase")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }

                // Cycle Day
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("Day \(entry.cycleDay)")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.white)

                    Text("of \(entry.totalCycleDays)")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.white.opacity(0.8))
                }

                // Today's Focus
                VStack(alignment: .leading, spacing: 6) {
                    Text("TODAY'S FOCUS")
                        .font(.system(size: 12, weight: .semibold))
                        .tracking(0.5)
                        .foregroundColor(.white.opacity(0.9))

                    Text(entry.todaysFocus)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.white)
                        .lineLimit(2)
                }
                .padding(12)
                .background(.white.opacity(0.15))
                .cornerRadius(12)

                Spacer()

                // Footer
                HStack {
                    Text("IRIS")
                        .font(.system(size: 14, weight: .bold))
                        .tracking(2)
                        .foregroundColor(.white.opacity(0.8))

                    Spacer()

                    Text(entry.lastUpdated)
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(.white.opacity(0.6))
                }
            }
            .padding(16)
        }
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespaces)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)

        let r = Double((rgb >> 16) & 0xFF) / 255.0
        let g = Double((rgb >> 8) & 0xFF) / 255.0
        let b = Double(rgb & 0xFF) / 255.0

        self.init(red: r, green: g, blue: b)
    }
}

// MARK: - Widget Bundle
@main
struct IrisWidgetBundle: WidgetBundle {
    var body: some Widget {
        IrisSmallWidget()
        IrisMediumWidget()
    }
}

// MARK: - Small Widget
struct IrisSmallWidget: Widget {
    let kind: String = "se.mojjo.iris.widget.small"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: IrisWidgetProvider()) { entry in
            IrisWidgetSmallView(entry: entry)
        }
        .configurationDisplayName("IRIS Cycle Widget")
        .description("Shows your current cycle phase and today's focus")
        .supportedFamilies([.systemSmall])
    }
}

// MARK: - Medium Widget
struct IrisMediumWidget: Widget {
    let kind: String = "se.mojjo.iris.widget.medium"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: IrisWidgetProvider()) { entry in
            IrisWidgetMediumView(entry: entry)
        }
        .configurationDisplayName("IRIS Cycle Widget")
        .description("Shows your current cycle phase, day, and today's focus")
        .supportedFamilies([.systemMedium])
    }
}

// MARK: - Widget Preview
#Preview(as: .systemSmall) {
    IrisSmallWidget()
} timeline: {
    IrisWidgetEntry(
        date: Date(),
        phaseName: "Follicular",
        phaseColor: "#FFB627",
        cycleDay: 14,
        totalCycleDays: 28,
        todaysFocus: "Focus on building energy",
        lastUpdated: "Now",
        hasData: true
    )
}

#Preview(as: .systemMedium) {
    IrisMediumWidget()
} timeline: {
    IrisWidgetEntry(
        date: Date(),
        phaseName: "Ovulation",
        phaseColor: "#E89BA4",
        cycleDay: 14,
        totalCycleDays: 28,
        todaysFocus: "Focus on building energy and momentum",
        lastUpdated: "Now",
        hasData: true
    )
}
