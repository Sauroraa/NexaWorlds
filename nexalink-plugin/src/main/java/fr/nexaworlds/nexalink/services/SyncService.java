package fr.nexaworlds.nexalink.services;

import com.google.gson.JsonObject;
import fr.nexaworlds.nexalink.NexaLink;
import fr.nexaworlds.nexalink.api.ApiClient;
import org.bukkit.Bukkit;
import org.bukkit.scheduler.BukkitTask;

import java.util.ArrayList;
import java.util.List;

public class SyncService {

    private final NexaLink plugin;
    private final ApiClient apiClient;
    private final List<BukkitTask> tasks = new ArrayList<>();

    public SyncService(NexaLink plugin, ApiClient apiClient) {
        this.plugin = plugin;
        this.apiClient = apiClient;
    }

    public void startAll() {
        int tpsInterval = plugin.getConfig().getInt("sync.tps-interval", 60) * 20;
        int playersInterval = plugin.getConfig().getInt("sync.players-interval", 30) * 20;

        // Sync TPS
        tasks.add(Bukkit.getScheduler().runTaskTimerAsynchronously(plugin, this::syncTps, 100L, tpsInterval));

        // Sync Players
        tasks.add(Bukkit.getScheduler().runTaskTimerAsynchronously(plugin, this::syncPlayers, 60L, playersInterval));

        plugin.getLogger().info("Sync tasks started.");
    }

    public void stopAll() {
        tasks.forEach(BukkitTask::cancel);
        tasks.clear();
    }

    private void syncTps() {
        try {
            double[] tps = Bukkit.getTPS();
            JsonObject data = new JsonObject();
            data.addProperty("tps1m", Math.round(tps[0] * 100.0) / 100.0);
            data.addProperty("tps5m", Math.round(tps[1] * 100.0) / 100.0);
            data.addProperty("tps15m", Math.round(tps[2] * 100.0) / 100.0);
            data.addProperty("serverName", plugin.getServer().getName());

            apiClient.post("/nexalink/tps", data);
        } catch (Exception e) {
            plugin.getLogger().warning("Failed to sync TPS: " + e.getMessage());
        }
    }

    private void syncPlayers() {
        try {
            JsonObject data = new JsonObject();
            data.addProperty("online", Bukkit.getOnlinePlayers().size());
            data.addProperty("max", Bukkit.getMaxPlayers());

            com.google.gson.JsonArray players = new com.google.gson.JsonArray();
            Bukkit.getOnlinePlayers().forEach(p -> {
                JsonObject player = new JsonObject();
                player.addProperty("name", p.getName());
                player.addProperty("uuid", p.getUniqueId().toString());
                players.add(player);
            });
            data.add("players", players);

            apiClient.post("/nexalink/players", data);
        } catch (Exception e) {
            plugin.getLogger().warning("Failed to sync players: " + e.getMessage());
        }
    }
}
